const express = require('express')
const pool = require('../db')
const router = express.Router()

router.post('/', async (req, res) => {
	const { blogId, userId, comment } = req.body
	try {
		const result = await pool.query(
			'INSERT INTO comments (blog_id, user_id, content) VALUES($1, $2, $3) RETURNING *',
			[blogId, userId, comment]
		)
		res.json(result.rows[0])
	} catch (error) {
		console.log(error)
	}
})

router.get('/:blogId', async (req, res) => {
	const { blogId } = req.params
	try {
		const result = await pool.query(
			'SELECT comments.id, comments.content, users.id as user_id, users.username, users.avatar_url FROM comments LEFT JOIN users ON users.id = comments.user_id WHERE comments.blog_id = $1 ORDER BY comments.created_at DESC',
			[blogId]
		)
		res.json(result.rows)
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
