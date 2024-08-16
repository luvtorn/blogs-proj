import axios from 'axios'
import { FormEvent } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { localUrl } from '../../services/api'
import { blogStore } from '../../stores/BlogStore'

export const createBlogAction = async (
	e: FormEvent<HTMLFormElement>,
	title: string,
	content: string,
	id: number | undefined,
	file: File | null,
	tags: string[],
	navigate: NavigateFunction
) => {
	e.preventDefault()

	if (!id) {
		return
	}

	const formData = new FormData()
	formData.append('title', title)
	formData.append('content', content)
	formData.append('userId', String(id))
	if (file) {
		formData.append('image', file)
	}

	tags
		.filter(tag => tag !== '')
		.forEach(tag => {
			formData.append(`tags[]`, tag)
		})

	try {
		await axios.post(`${localUrl}/blogs/create`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		blogStore.loadBlogs()

		navigate('/')
	} catch (err) {
		console.error(err)
	}
}
