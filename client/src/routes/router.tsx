import { createBrowserRouter } from 'react-router-dom'
import BlogsByTagPage from '../components/BlogsByTag/BlogsByTagPage'
import BlogPage from '../pages/BlogInfoPage/BlogPage'
import Blogs from '../pages/Blogs/Blogs'
import ChangeBlog from '../pages/ChangeBlog/ChangeBlog'
import ChangeUserInfo from '../pages/ChangeUser/ChangeUserInfo'
import CreateBlog from '../pages/CreateBlog/CreateBlog'
import Login from '../pages/Login/Login'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import Register from '../pages/Register/Register'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Blogs />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/register',
		element: <Register />,
	},
	{
		path: '/create',
		element: <CreateBlog />,
	},
	{
		path: '/blog/:id',
		element: <BlogPage />,
	},
	{
		path: '/change/:id',
		element: <ChangeBlog />,
	},
	{
		path: '/blogs/tag/:tag',
		element: <BlogsByTagPage />,
	},
	{
		path: '/profile/:id',
		element: <ProfilePage />,
	},
	{
		path: '/changeUser/:id',
		element: <ChangeUserInfo />,
	},
])

export default router
