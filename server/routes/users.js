const express = require('express')
const pool = require('../db')
const router = express.Router()
const multer = require('multer')
const { authenticateToken } = require('../middleware/authMiddleware')
const { storage } = require('../config/multerConfig')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

const upload = multer({ storage })

router.get('/', async (req, res) => {
	try {
		const result = await pool.query(
			'SELECT username, id, avatar_url FROM users'
		)
		if (result.rows.length === 0) {
			return res.status(400).json({ error: 'Error in getting users' })
		}
		res.json(result.rows)
	} catch (error) {
		console.log(e)
	}
})

router.put(
	'/changeUser/:id',
	authenticateToken,
	upload.single('image'),
	async (req, res) => {
		const { id } = req.params
		const { username, image_url } = req.body
		let imageUrl = image_url
		if (req.file) {
			imageUrl = req.file.path
		}
		const result = await pool.query(
			'UPDATE users SET username = $1, avatar_url = $2 WHERE id = $3 RETURNING *',
			[username, imageUrl, id]
		)
		const newToken = jwt.sign(
			{ userId: id, username, avatar_url: imageUrl },
			JWT_SECRET,
			{ expiresIn: '1h' }
		)
		res.json({ result, token: newToken })
	}
)

module.exports = router
