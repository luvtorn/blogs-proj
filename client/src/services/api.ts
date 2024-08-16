import axios from 'axios'

const localUrl = 'http://172.20.10.5:5000'

const api = axios.create({
	baseURL: `${localUrl}`,
})

export { api, localUrl }
