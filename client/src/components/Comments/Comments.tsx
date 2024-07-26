import { useQuery } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { localUrl } from '../../services/api'
import { blogService } from '../../services/Blog.service'
import authStore from '../../stores/AuthStore'
import './Comments.scss'

interface CommentsProps {
	blogId: number
}

const Comments = ({ blogId }: CommentsProps) => {
	const { authUser, isLoggedIn } = authStore
	const [error, setError] = useState('')
	const [comment, setComment] = useState('')
	const navigate = useNavigate()

	const { data, refetch } = useQuery({
		queryKey: ['comments'],
		queryFn: () => blogService.getComments(blogId),
		select: data => data,
	})

	const handleSendComment = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isLoggedIn && authUser) {
			const { id } = authUser

			try {
				const response = await blogService.sendComment(blogId, id, comment)

				if (response?.status === 200) {
					setComment('')
					refetch()
				}
			} catch (error) {}
		} else {
			setError('You need to log in for write a comment')
		}
	}

	if (!data) {
		return <h3>Loading...</h3>
	}

	return (
		<div className='comments'>
			<form className='comments__form' onSubmit={e => handleSendComment(e)}>
				<input
					type='text'
					className='input-comment'
					placeholder='Write a comment...'
					value={comment}
					onChange={e => setComment(e.target.value)}
					required
				></input>
				<button type='submit'>
					<IoSend size={'18px'} color='white' />
				</button>
			</form>
			<br />
			<h4 style={{ color: 'red' }}>{error}</h4>
			<div className='comments__items'>
				{data.length > 0 ? (
					data.map(comment => (
						<div className='comment' key={comment.id}>
							<div
								className='comment__user'
								onClick={() => navigate(`/profile/${comment.user_id}`)}
							>
								<img
									src={`${localUrl}/${comment.avatar_url}`}
									className='blog__avatar'
									alt='avatar'
								/>
								<h4>{comment.username}</h4>
							</div>
							<div className='comment__text'>{comment.content}</div>
						</div>
					))
				) : (
					<h3 style={{ textAlign: 'center' }}>No comments yet</h3>
				)}
			</div>
		</div>
	)
}

export default Comments
