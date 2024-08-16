const express = require('express')
const pool = require('../db')
const multer = require('multer')
const { authenticateToken } = require('../middleware/authMiddleware')
const { storage } = require('../config/multerConfig')

const router = express.Router()
const upload = multer({ storage })

router.post('/create', upload.single('image'), async (req, res) => {
	const { title, content, userId } = req.body
	const image = req.file ? req.file.path : null
	const tags = req.body.tags || []
	try {
		const result = await pool.query(
			'INSERT INTO blogs (user_id, title, content, image_url, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
			[userId, title, content, image]
		)
		const blogId = result.rows[0].id
		await Promise.all(
			tags.map(async tag => {
				let tagId
				const existingTag = await pool.query(
					'SELECT id FROM tags WHERE name = $1',
					[tag]
				)
				if (existingTag.rows.length > 0) {
					tagId = existingTag.rows[0].id
				} else {
					const newTag = await pool.query(
						'INSERT INTO tags (name) VALUES ($1) RETURNING id',
						[tag]
					)
					tagId = newTag.rows[0].id
				}
				await pool.query(
					'INSERT INTO blog_tags (blog_id, tag_id) VALUES ($1, $2)',
					[blogId, tagId]
				)
			})
		)
		res.json({ message: 'Blog created' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: err.message })
	}
})

router.get('/', async (req, res) => {
	const { sortBy } = req.query

	let orderClause = 'ORDER BY blogs.created_at DESC'

	if (sortBy === 'popular') {
		orderClause = 'ORDER BY blogs.views_count DESC'
	} else if (sortBy === 'new') {
		orderClause = 'ORDER BY blogs.created_at DESC'
	}

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
      ${orderClause};`
		)
		res.json(result.rows)
	} catch (e) {
		console.log(e)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

router.get('/tag/:id', async (req, res) => {
	try {
		const { id } = req.params
		const blogsByTag = await pool.query(
			`SELECT blogs.id AS blog_id, blogs.content, blogs.title, blogs.image_url, blogs.created_at, users.username, users.avatar_url, users.id AS user_id
      FROM blogs
      LEFT JOIN users ON blogs.user_id = users.id
      LEFT JOIN blog_tags ON blogs.id = blog_tags.blog_id
      LEFT JOIN tags ON blog_tags.tag_id = tags.id
      WHERE tags.id = $1;`,
			[id]
		)
		res.json(blogsByTag.rows)
	} catch (error) {
		console.log(error)
	}
})

router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const resultFromBlogs = await pool.query(
			`SELECT blogs.id AS blog_id, blogs.content, blogs.title, blogs.image_url, blogs.created_at, users.username, users.id AS user_id, users.avatar_url FROM blogs LEFT JOIN users ON blogs.user_id = users.id WHERE blogs.id = $1;`,
			[id]
		)
		if (resultFromBlogs.rows.length === 0) {
			return res.status(400).json({ error: 'Error in getting blogs' })
		}
		const resultFromTags = await pool.query(
			`SELECT tags.id, tags.name
       FROM tags
       JOIN blog_tags ON tags.id = blog_tags.tag_id
       WHERE blog_tags.blog_id = $1`,
			[id]
		)
		res.json({ ...resultFromBlogs, tags: resultFromTags.rows })
	} catch (e) {
		console.log(e)
	}
})

router.put(
	'/update-views/:id',
	(req, res, next) => {
		console.log('Updating views for blog with id:', req.params.id)
		next()
	},
	async (req, res) => {
		const { id } = req.params
		try {
			await pool.query(
				'UPDATE blogs SET views_count = views_count + 1 WHERE id = $1',
				[id]
			)
			res.status(200).json({ message: 'Views count updated successfully' })
		} catch (error) {
			console.error(
				`Failed to update views count for blog with id ${id}:`,
				error
			)
			res.status(500).json({ error: 'Failed to update views count' })
		}
	}
)

router.put(
	'/:id',
	authenticateToken,
	upload.single('image'),
	async (req, res) => {
		const client = await pool.connect()
		try {
			const { id } = req.params
			const { title, content, image_url, tags } = req.body
			let imageUrl = image_url
			if (req.file) {
				imageUrl = req.file.path
			}
			await client.query('BEGIN')
			const result = await client.query(
				'UPDATE blogs SET title = $1, content = $2, image_url = $3 WHERE id = $4 RETURNING *',
				[title, content, imageUrl, id]
			)
			await client.query('DELETE FROM blog_tags WHERE blog_id = $1', [id])
			const tagsArray = JSON.parse(tags)
			for (const tag of tagsArray) {
				let result = await client.query('SELECT id FROM tags WHERE name = $1', [
					tag,
				])
				let tagId
				if (result.rows.length === 0) {
					result = await client.query(
						'INSERT INTO tags (name) VALUES ($1) RETURNING id',
						[tag]
					)
					tagId = result.rows[0].id
				} else {
					tagId = result.rows[0].id
				}
				await client.query(
					'INSERT INTO blog_tags (blog_id, tag_id) VALUES ($1, $2)',
					[id, tagId]
				)
			}
			await client.query(
				`DELETE FROM tags WHERE id IN (
        SELECT t.id FROM tags t LEFT JOIN blog_tags bt ON t.id = bt.tag_id
        WHERE bt.tag_id IS NULL
      )`
			)
			await client.query('COMMIT')
			res.json(result.rows[0])
		} catch (err) {
			await client.query('ROLLBACK')
			console.error(err)
			res.status(500).json({ error: 'Internal server error' })
		} finally {
			client.release()
		}
	}
)

router.delete('/:id', authenticateToken, async (req, res) => {
	const { id } = req.params
	const { userId } = req.user
	const client = await pool.connect()
	try {
		const blogResult = await pool.query('SELECT * FROM blogs WHERE id = $1', [
			id,
		])
		if (blogResult.rows.length === 0) {
			return res.status(404).json({ error: 'Blog not found' })
		}
		const blog = blogResult.rows[0]
		if (blog.user_id !== userId) {
			return res
				.status(403)
				.json({ error: 'You are not authorized to delete this blog' })
		}
		await client.query('DELETE FROM comments WHERE blog_id = $1', [id])
		await client.query('DELETE FROM blog_tags WHERE blog_id = $1', [id])
		await client.query('DELETE FROM blogs WHERE id = $1', [id])
		await client.query(
			`DELETE FROM tags WHERE id IN (
        SELECT t.id FROM tags t LEFT JOIN blog_tags bt ON t.id = bt.tag_id
        WHERE bt.tag_id IS NULL
      ) RETURNING id`
		)
		res.status(204).send()
	} catch (error) {
		console.error('Error deleting blog:', error.message)
		res.status(500).json({ error: 'Server error' })
	} finally {
		client.release()
	}
})

module.exports = router
