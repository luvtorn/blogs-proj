import { observer } from 'mobx-react-lite'
import { MdDelete, MdEdit } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import BlogTitle from '../../components/Blog/BlogTitle'
import Comments from '../../components/Comments/Comments'
import Header from '../../components/Header/Header'
import useAuth from '../../hooks/useAuth'
import useHover from '../../hooks/useHover'
import { localUrl } from '../../services/api'
import { blogStore } from '../../stores/BlogStore'
import './BlogPage.scss'

const BlogPage = observer(() => {
	const navigate = useNavigate()
	const { isHovered, mouseOut, mouseOver } = useHover()
	const { id } = useParams()

	const blog = blogStore.getBlogById(Number(id))?.[0]

	const handleDelete = blogStore.deleteBlog({ id: Number(id), navigate })
	const handleChange = blogStore.changeBlog({ id: Number(id), navigate })

	useAuth()

	if (!blog) {
		return <h2>Loading...</h2>
	}

	return (
		<>
			<Header />
			<div className='container blog-page-container'>
				<button className='back' onClick={() => navigate(-1)}>
					Back
				</button>
				<div
					className='blog-page'
					onMouseOver={() => mouseOver(blog.user_id)}
					onMouseOut={mouseOut}
				>
					{blog.image_url && blog.image_url !== 'null' && (
						<img
							src={`${localUrl}/${blog.image_url}`}
							alt='blog'
							style={{ borderRadius: '10px' }}
						/>
					)}

					{isHovered && (
						<div className='blog__edit-btns'>
							<button onClick={handleChange}>
								<MdEdit size={'17px'} />
							</button>
							<button onClick={handleDelete}>
								<MdDelete size={'17px'} />
							</button>
						</div>
					)}
					<BlogTitle
						blog={{
							author: blog.username,
							avatar_url: blog.avatar_url,
							created_at: blog.created_at,
							tags: blog.tags,
							title: blog.title,
						}}
					/>

					<div className='blog-page__name'>
						<h3>{blog.title}</h3>
					</div>

					<ReactMarkdown className='blog-page__content'>
						{blog.content}
					</ReactMarkdown>
				</div>
				<Comments blogId={blog.blog_id} />
			</div>
		</>
	)
})

export default BlogPage
