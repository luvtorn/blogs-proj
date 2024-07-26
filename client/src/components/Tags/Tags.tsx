import { useQuery } from '@tanstack/react-query'
import { HiOutlineHashtag } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { blogService } from '../../services/Blog.service'
import './Tags.scss'

const Tags = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['tags'],
		queryFn: () => blogService.getTags(),
		select: data => data,
	})

	const navigate = useNavigate()

	if (isLoading) {
		return <h4>Loading...</h4>
	}

	return (
		<div className='tags'>
			<h4>Tags</h4>
			<br />
			<div className='tags__item'>
				{data?.map(tag => (
					<div
						className='tag'
						key={tag.id}
						onClick={() => navigate(`/blogs/tag/${tag.id}`)}
					>
						<HiOutlineHashtag />
						{tag.name}
					</div>
				))}
			</div>
		</div>
	)
}

export default Tags
