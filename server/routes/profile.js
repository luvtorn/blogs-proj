const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
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

module.exports = router;
