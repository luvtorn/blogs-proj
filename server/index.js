const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const multer = require("multer");
const PORT = 5000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const { JWT_SECRET } = process.env;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT 
  users.id AS user_id, 
  users.username,
  users.avatar_url,
  COUNT(blogs.id) AS blogs_count, 
  json_agg(
    json_build_object(
      'id', blogs.id, 
      'title', blogs.title, 
      'content', blogs.content, 
      'views_count', blogs.views_count,
      'image_url', blogs.image_url, 
      'created_at', blogs.created_at,
      'tags', COALESCE(
        (SELECT json_agg(
                  json_build_object(
                    'id', tags.id, 
                    'name', tags.name
                  )
                )
         FROM tags
         JOIN blog_tags ON tags.id = blog_tags.tag_id
         WHERE blog_tags.blog_id = blogs.id), '[]'
      )
    )
  ) AS blogs 
FROM users 
LEFT JOIN blogs ON blogs.user_id = users.id 
WHERE users.id = $1 
GROUP BY users.id;`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
  }
});

app.put(
  "/changeUser/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { username, image_url } = req.body;
    let imageUrl = image_url;

    if (req.file) {
      imageUrl = req.file.path;
    }

    const result = await pool.query(
      "UPDATE users SET username = $1, avatar_url = $2 WHERE id = $3 RETURNING *",
      [username, imageUrl, id]
    );

    const newToken = jwt.sign(
      { userId: id, username, avatar_url: imageUrl },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ result, token: newToken });
  }
);

app.put(
  "/change/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, image_url, tags } = req.body;
      let imageUrl = image_url;

      if (req.file) {
        imageUrl = req.file.path;
      }

      const result = await pool.query(
        "UPDATE blogs SET title = $1, content = $2, image_url = $3 WHERE id = $4 RETURNING *",
        [title, content, imageUrl, id]
      );

      await pool.query("DELETE FROM blog_tags WHERE blog_id = $1", [id]);

      const tagsArray = JSON.parse(tags);

      for (const tag of tagsArray) {
        let result = await pool.query("SELECT id FROM tags WHERE name = $1", [
          tag,
        ]);
        let tagId;
        if (result.rows.length === 0) {
          result = await pool.query(
            "INSERT INTO tags (name) VALUES ($1) RETURNING id",
            [tag]
          );
          tagId = result.rows[0].id;
        } else {
          tagId = result.rows[0].id;
        }
        await pool.query(
          "INSERT INTO blog_tags (blog_id, tag_id) VALUES ($1, $2)",
          [id, tagId]
        );
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.delete("/blog/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const client = await pool.connect();

  try {
    const blogResult = await pool.query("SELECT * FROM blogs WHERE id = $1", [
      id,
    ]);

    if (blogResult.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const blog = blogResult.rows[0];
    if (blog.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this blog" });
    }

    await client.query("DELETE FROM blog_tags WHERE blog_id = $1", [id]);
    await client.query("DELETE FROM blogs WHERE id = $1", [id]);

    await client.query(`
      DELETE FROM tags
      WHERE id IN (
        SELECT t.id
        FROM tags t
        LEFT JOIN blog_tags bt ON t.id = bt.tag_id
        WHERE bt.tag_id IS NULL
      )
      RETURNING id
    `);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/blogs/tag/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const blogsByTag = await pool.query(
      `SELECT blogs.id AS blog_id, blogs.content, blogs.title, blogs.image_url, blogs.created_at, users.username, users.avatar_url, users.id AS user_id
      FROM blogs
      LEFT JOIN users ON blogs.user_id = users.id
      LEFT JOIN blog_tags ON blogs.id = blog_tags.blog_id
      LEFT JOIN tags ON blog_tags.tag_id = tags.id
      WHERE tags.id = $1;`,
      [id]
    );

    res.json(blogsByTag.rows);
  } catch (error) {
    console.log(error);
  }
});

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

app.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(userName, password);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [userName, hashedPassword]
    );
    const token = generateToken({
      id: result.rows[0].id,
      username: result.rows[0].username,
    });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/create", upload.single("image"), async (req, res) => {
  const { title, content, userId } = req.body;
  const image = req.file ? req.file.path : null;
  const tags = req.body.tags || [];

  console.log(req.body);

  try {
    const result = await pool.query(
      "INSERT INTO blogs (user_id, title, content, image_url, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [userId, title, content, image]
    );

    const blogId = result.rows[0].id;

    await Promise.all(
      tags.map(async (tag) => {
        let tagId;

        const existingTag = await pool.query(
          "SELECT id FROM tags WHERE name = $1",
          [tag]
        );

        if (existingTag.rows.length > 0) {
          tagId = existingTag.rows[0].id;
        } else {
          const newTag = await pool.query(
            "INSERT INTO tags (name) VALUES ($1) RETURNING id",
            [tag]
          );
          tagId = newTag.rows[0].id;
        }

        await pool.query(
          "INSERT INTO blog_tags (blog_id, tag_id) VALUES ($1, $2)",
          [blogId, tagId]
        );
      })
    );

    res.json({ message: "Blog created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT username, id, avatar_url FROM users"
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Error in getting users" });
    }

    res.json(result.rows);
  } catch (error) {
    console.log(e);
  }
});

app.get("/tags", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags");
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Error in getting users" });
    }
    res.json(result.rows);
  } catch (error) {
    console.log(e);
  }
});

app.get("/blogs", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
  blogs.id AS blog_id,
  blogs.title,
  blogs.content,
  blogs.image_url,
  blogs.created_at,
  blogs.views_count,
  users.username,
  users.avatar_url,
  users.id AS user_id,
  COALESCE(json_agg(
    json_build_object(
      'id', tags.id,
      'name', tags.name
    )
  ) FILTER (WHERE tags.id IS NOT NULL), '[]') AS tags
FROM blogs
LEFT JOIN users ON blogs.user_id = users.id
LEFT JOIN blog_tags ON blogs.id = blog_tags.blog_id
LEFT JOIN tags ON blog_tags.tag_id = tags.id
GROUP BY blogs.id, users.username, users.id
ORDER BY blogs.created_at DESC;
`
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Error in getting blogs" });
    }

    res.json(result.rows);
  } catch (e) {
    console.log(e);
  }
});

app.get("/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultFromBlogs = await pool.query(
      `SELECT blogs.id AS blog_id, blogs.content, blogs.title, blogs.image_url, blogs.created_at, users.username, users.id AS user_id, users.avatar_url FROM blogs LEFT JOIN users ON blogs.user_id = users.id WHERE blogs.id = $1;`,
      [id]
    );

    if (resultFromBlogs.rows.length === 0) {
      return res.status(400).json({ error: "Error in getting blogs" });
    }

    const resultFromTags = await pool.query(
      `SELECT tags.id, tags.name
       FROM tags
       JOIN blog_tags ON tags.id = blog_tags.tag_id
       WHERE blog_tags.blog_id = $1`,
      [id]
    );

    res.json({ ...resultFromBlogs, tags: resultFromTags.rows });
  } catch (e) {
    console.log(e);
  }
});

app.put("/update-views/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await pool.query(
      "UPDATE blogs SET views_count = views_count + 1 WHERE id = $1",
      [id]
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      userName,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid login or password" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
    });

    res.json({
      token,
      userName: user.username,
      userId: user.id,
      avatar_url: user.avatar_url,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
