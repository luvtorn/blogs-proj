import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { localUrl } from '../../services/api'
import { blogService } from '../../services/Blog.service'
import './Users.scss'

const Users = () => {
	const navigate = useNavigate()

	const { data, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: () => blogService.getUsers(),
		select: data => data,
	})

	if (isLoading) {
		return <h2>Loading...</h2>
	}

	return (
		<div className='users'>
			<h4>Users</h4>
			<br />
			<div className='users__items'>
				{data?.map(user => (
					<div
						className='user'
						key={user.id}
						onClick={() => navigate(`/profile/${user.id}`)}
					>
						<img
							src={
								user.avatar_url !== null
									? `${localUrl}/${user.avatar_url}`
									: '/avatar.svg'
							}
							alt='avatar'
						/>
						<span className='user__name'>{user.username}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default memo(Users)
