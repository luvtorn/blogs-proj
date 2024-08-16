const express = require('express')
const pool = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { JWT_SECRET } = process.env

const generateToken = user => {
	return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' })
}

router.post('/', async (req, res) => {
	const { userName, password } = req.body
	const hashedPassword = await bcrypt.hash(password, 10)
	try {
		const result = await pool.query(
			'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
			[userName, hashedPassword]
		)
		const token = generateToken({
			id: result.rows[0].id,
			username: result.rows[0].username,
		})
		res.json({ token })
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

module.exports = router
