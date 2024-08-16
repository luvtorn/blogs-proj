import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import useFile from '../../hooks/useFile'
import authStore from '../../stores/AuthStore'
import './CreateBlog.scss'
import { createBlogAction } from './create-blog'

const CreateBlog = () => {
	const [title, setTitle] = useState<string>('')
	const [tags, setTags] = useState<string[]>([])
	const [content, setContent] = useState<string>('')
	const { authUser } = authStore
	const { handleFileChange, file, preview, setPreview } = useFile()
	const navigate = useNavigate()

	const handleChangeTags = (tagsInput: string) => {
		const tagsArray = tagsInput.split(' ').filter(tag => tag.trim() !== '')
		setTags(tagsArray)
	}

	return (
		<>
			<Header />
			<div className='container'>
				<form
					className='add-blog'
					onSubmit={e =>
						createBlogAction(
							e,
							title,
							content,
							authUser?.id,
							file,
							tags,
							navigate
						)
					}
				>
					<input
						type='file'
						id='add-blog__file'
						hidden
						autoFocus
						onChange={handleFileChange}
					/>
					<label htmlFor='add-blog__file' className='add-blog__file' autoFocus>
						Upload Preview
					</label>

					{preview && (
						<div className='preview'>
							<button className='delete' onClick={() => setPreview('')}>
								Delete
							</button>
							<img src={preview} alt='Preview' className='preview__image' />
						</div>
					)}

					<input
						type='text'
						className='add-blog__title'
						placeholder='Write a title...'
						value={title}
						onChange={e => setTitle(e.target.value)}
						required
					/>
					<input
						type='text'
						className='add-blog__tags'
						placeholder='Tags'
						onChange={e => handleChangeTags(e.target.value)}
					/>

					{tags.length > 0 ? (
						<div className='tags-container'>
							{tags.map((tag, index) => (
								<span key={index} className='tag'>
									{tag}
								</span>
							))}
						</div>
					) : (
						''
					)}

					<textarea
						className='add-blog__content'
						placeholder='Write a text...'
						onChange={e => setContent(e.target.value)}
						value={content}
						required
					></textarea>

					<div className='add-blog__buttons'>
						<button className='publish-btn'>Publish</button>
						<Link to={'/'} className='cancel-btn'>
							Cancel
						</Link>
					</div>
				</form>
			</div>
		</>
	)
}

export default CreateBlog
