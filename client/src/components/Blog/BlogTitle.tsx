import useData from '../../hooks/useData'
import { localUrl } from '../../services/api'
import { BlogTitleProp } from '../../types/types'
import './Blog.scss'

const BlogTitle = ({ blog }: BlogTitleProp) => {
	return (
		<div className='blog__title'>
			<img
				src={`${localUrl}/${
					blog.avatar_url !== null ? blog.avatar_url : '/avatar.svg'
				}`}
				className='blog__avatar'
				alt='avatar'
			/>
			<div className='blog__text'>
				<h4>{blog.author}</h4>
				<div className='blog-page__tags'>
					{blog?.tags.map(tag => (
						<p key={tag.id}>{tag.name}</p>
					))}
				</div>
				<p>{useData(blog.created_at)}</p>
			</div>
		</div>
	)
}

export default BlogTitle
