import { useParams } from 'react-router-dom'
import { blogStore } from '../../stores/BlogStore'
import Blog from '../Blog/Blog'
import Header from '../Header/Header'
import Tags from '../Tags/Tags'
import Users from '../Users/Users'

const BlogsByTagPage = () => {
	const { tag } = useParams()

	const data = blogStore.getBlogsByTag(Number(tag))

	return (
		<div>
			<Header />
			<div className='container'>
				<div className='blogs'>
					{data?.map(blog => (
						<Blog
							key={blog.blog_id}
							blog={{
								title: blog.title,
								author: blog.username,
								authorId: blog.user_id,
								blogId: blog.blog_id,
								created_at: blog.created_at,
								avatar_url: blog.avatar_url,
								tags: blog.tags,
								image_url: blog.image_url,
								views_count: blog.views_count,
							}}
						/>
					))}
				</div>
				<aside
					style={{
						width: '30%',
						display: 'flex',
						flexDirection: 'column',
						gap: '20px',
					}}
				>
					<Tags />
					<Users />
				</aside>
			</div>
		</div>
	)
}

export default BlogsByTagPage
