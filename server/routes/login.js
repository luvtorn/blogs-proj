const express = require('express')
const pool = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const router = express.Router()

const generateToken = user => {
	return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' })
}

router.post('/', async (req, res) => {
	console.log('Sidra')
	const { userName, password } = req.body
	try {
		const result = await pool.query('SELECT * FROM users WHERE username = $1', [
			userName,
		])
		if (result.rows.length === 0) {
			return res.status(400).json({ error: 'Invalid login or password' })
		}
		const user = result.rows[0]
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid credentials' })
		}
		const token = generateToken({
			userId: user.id,
			username: user.username,
			avatar_url: user.avatar_url,
		})
		res.json({
			token,
			userName: user.username,
			userId: user.id,
			avatar_url: user.avatar_url,
		})
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

module.exports = router
