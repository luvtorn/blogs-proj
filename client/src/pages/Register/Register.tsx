import axios from 'axios'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { localUrl } from '../../services/api'
import './Register.scss'

const Register = () => {
	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState('')
	const [confPassword, setConfPassword] = useState('')

	const navigate = useNavigate()

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (password === confPassword) {
			axios
				.post(`${localUrl}/register`, { userName, password })
				.then(() => {
					navigate('/login')
				})
				.catch(error => {
					console.error('Axios Error:', error)
				})
		} else {
			alert('Confirm your password')
		}
	}

	return (
		<>
			<Header />
			<div className='login'>
				<h2>Sign up</h2>
				<br />

				<form className='login__form' onSubmit={e => handleSubmit(e)}>
					<input
						type='text'
						className='login_input'
						placeholder='Write your login...'
						value={userName}
						onChange={e => setUserName(e.target.value)}
						required
					/>

					<input
						type='password'
						className='login_password'
						placeholder='Write your password...'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>

					<input
						type='password'
						className='login_password'
						placeholder='Confirm your password...'
						value={confPassword}
						onChange={e => setConfPassword(e.target.value)}
						required
					/>

					<br />

					<div className='buttons'>
						<button type='submit' className='login_btn'>
							Sign up
						</button>
						<Link to='/login' className='sign-up_btn'>
							Login
						</Link>
					</div>
				</form>
			</div>
		</>
	)
}

export default Register
