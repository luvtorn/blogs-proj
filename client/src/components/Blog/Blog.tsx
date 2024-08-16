import { FC } from 'react'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import useHover from '../../hooks/useHover'
import { localUrl } from '../../services/api'
import { blogService } from '../../services/Blog.service'
import { BlogProp } from '../../types/types'
import './Blog.scss'
import BlogTitle from './BlogTitle'

const Blog: FC<BlogProp> = ({ blog }) => {
	const navigate = useNavigate()
	const { mouseOver, mouseOut } = useHover()

	const openBlogInfo = (blogId: number) => {
		try {
			blogService.updateViewsCount(blogId)
			navigate(`/blog/${blogId}`)
		} catch (error) {
			console.error('Error opening blog info', error)
		}
	}

	return (
		<div
			className='blog'
			onMouseOver={() => mouseOver(blog.authorId)}
			onMouseOut={() => mouseOut()}
			onClick={() => openBlogInfo(blog.blogId)}
		>
			{blog.image_url && blog.image_url !== 'null' && (
				<img src={`${localUrl}/${blog.image_url}`} alt='preview' />
			)}

			<BlogTitle blog={blog} />
			<div className='blog__name'>
				<h3>{blog.title}</h3>
			</div>
			<div className='blog__footer'>
				<p>
					{blog.views_count}
					<FaEye />
				</p>
			</div>
		</div>
	)
}

export default Blog
