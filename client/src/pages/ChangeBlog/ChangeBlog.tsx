import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useFile from '../../hooks/useFile'
import { localUrl } from '../../services/api'
import { blogService } from '../../services/Blog.service'
import { blogStore } from '../../stores/BlogStore'
import Header from '../../components/Header/Header'
import './ChangeBlog.scss'

const ChangeBlog = () => {
	const [title, setTitle] = useState<string>('')
	const [tags, setTags] = useState<string>('')
	const [content, setContent] = useState<string>('')
	const [currentImageUrl, setCurrentImageUrl] = useState<string>('')
	const navigate = useNavigate()
	const { id } = useParams()

	const { file, handleFileChange, preview, setPreview } = useFile()

	const data = blogStore.getBlogById(Number(id))

	useEffect(() => {
		if (data) {
			setTitle(data[0].title)
			setContent(data[0].content)
			setTags(
				data[0].tags
					.map(tag => tag.name)
					.filter(tag => tag !== '')
					.join(' ')
			)
			setCurrentImageUrl(data[0].image_url)
		}
	}, [data])

	useAuth()

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			await blogService.changeBlog(
				Number(id),
				title,
				content,
				file,
				currentImageUrl,
				tags.split(' ')
			)
			navigate('/')
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<>
			<Header />
			<div className='container'>
				<form className='add-blog' onSubmit={handleSubmit}>
					<input
						type='file'
						id='add-blog__file'
						hidden
						onChange={handleFileChange}
					/>
					<label htmlFor='add-blog__file' className='add-blog__file'>
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
					{!preview && data && data[0].image_url && (
						<img
							src={`${localUrl}/${data[0].image_url}`}
							alt='Preview'
							className='preview__image'
						/>
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
						onChange={e => setTags(e.target.value)}
						value={tags}
					/>
					<div className='tags-container'>
						{tags.split(' ').map((tag, index) => (
							<span key={index} className='tag'>
								{tag}
							</span>
						))}
					</div>
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

export default ChangeBlog
