const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const commentsRoutes = require('./routes/comments')
const blogsRoutes = require('./routes/blogs')
const usersRoutes = require('./routes/users')
const loginRoutes = require('./routes/login')
const registerRoutes = require('./routes/register')
const profileRoutes = require('./routes/profile')
const tagsRoutes = require('./routes/tags')

// app.use((req, res, next) => {
// 	console.log(`${req.method} ${req.url}`)
// 	next()
// })

app.use('/comments', commentsRoutes)
app.use('/blogs', blogsRoutes)
app.use('/users', usersRoutes)
app.use('/login', loginRoutes)
app.use('/register', registerRoutes)
app.use('/profile', profileRoutes)
app.use('/tags', tagsRoutes)

app.listen(5000, '0.0.0.0', () => {
	console.log('Server is running on port 5000')
})
