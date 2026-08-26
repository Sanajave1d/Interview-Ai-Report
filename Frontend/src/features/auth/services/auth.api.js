import axios from 'axios'

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
})

export async function register({username, email, password}) {
    try {
        const response = await api.post(
            '/api/auth/register',
            { username, email, password },
        )
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error.response?.data)   // 👈 this is what your backend actually said
        throw error
    }
}

export async function login({username, email, password}) {
    try {
        const response = await api.post(
            '/api/auth/login',
            { username, email, password },
        )
        return response.data
    } catch (error) {
        console.log(error.response?.data)   // 👈 this is what your backend actually said
        throw error
    }
}

export async function logout() {
    try {
        const response = await api.post(
            '/api/auth/logout',
        )
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}
export async function getMe() {
    try {
        const response = await api.get(
            '/api/auth/get-me',
        )
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}




export default { register, login , logout, getMe }
