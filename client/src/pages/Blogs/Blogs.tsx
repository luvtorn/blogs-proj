import { useQuery } from '@tanstack/react-query'
import Blog from '../../components/Blog/Blog'
import Header from '../../components/Header/Header'
import Tags from '../../components/Tags/Tags'
import Users from '../../components/Users/Users'
import useAuth from '../../hooks/useAuth'
import { blogService } from '../../services/Blog.service'
import './Blogs.scss'

const Blogs = () => {
	const { getBlogs } = blogService

	const { data } = useQuery({
		queryKey: ['blogs'],
		queryFn: () => getBlogs(),
		select: data => data,
	})

	useAuth()

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
								tags: blog.tags,
								author: blog.username,
								authorId: blog.user_id,
								blogId: blog.blog_id,
								created_at: blog.created_at,
								avatar_url: blog.avatar_url,
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

export default Blogs
