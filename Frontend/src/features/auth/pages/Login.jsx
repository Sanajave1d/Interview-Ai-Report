import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../hooks/userAuth'
import Loader from '../../Loader'

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser]= useState('')
  const [password, setPassword]= useState('')
  const {loading , handleLogin}=  useAuth()

  const handleChange = (e) => {
    setUser(e.target.value)
  }

  const handlePasswordChange =(e)=>{
    setPassword(e.target.value)
  }
  const handleSubmit = async(e) => {
    e.preventDefault() 
    const isEmail = user.includes('@')

    const credentials = isEmail
        ? { email: user, password }
        : { username: user, password }

    await handleLogin(credentials)

    navigate('/')

    setUser('')
    setPassword('')
  }

  if(loading){
    return(
      <Loader/>
    )
  }
  return (
    <main className="bg-gray-950 min-h-screen flex items-center justify-center px-4">
      <div className="form-container bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Login
        </h1>

        <form className="flex flex-col gap-5"  onSubmit={handleSubmit}>
          <div className="input-group flex flex-col items-start gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Enter Email or Username
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value= {user}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-900 focus:border-transparent"
            />
          </div>

          <div className="input-group flex flex-col items-start gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Enter Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e)=>{
                handlePasswordChange(e)
              }}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-900 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="bg-pink-900 text-white font-medium rounded-lg py-2.5 mt-2 cursor-pointer hover:bg-pink-800 active:scale-x-95 transition-all duration-75"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already registered?{' '}
          <Link to="/register" className="text-pink-900 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  )
}