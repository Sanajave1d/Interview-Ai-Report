import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/userAuth"
import Loader from "../../Loader"

const Register = () => {
  const navigate = useNavigate()

  const {loading, handleRegister} = useAuth()
  
  const [user, setUser]= useState('')
  const [password, setPassword]= useState('')
  const [email, setEmail]= useState('')

  const handleChange = (e) => {
    setUser(e.target.value)
  }
  const handleEmailChange = (e)=>{
    setEmail(e.target.value)

  }

  const handlePasswordChange = async(e)=>{
    setPassword(e.target.value)
  }
  const handleSubmit = async(e) => {
    e.preventDefault() 
    console.log(user, email, password)
    await handleRegister({username: user, email, password})

    navigate('/')    
    setUser('')
    setPassword('')
    setEmail('')
  }
  if(loading){
    return(<Loader/>)
  }
  return (
    <main className="bg-gray-950 min-h-screen flex items-center justify-center px-4">
      <div className="form-container bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Register
        </h1>

        <form className="flex flex-col gap-5"  onSubmit={handleSubmit}>
          <div className="input-group flex flex-col items-start gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Enter Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value= {email}
              onChange={handleEmailChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-900 focus:border-transparent"
            />
          </div>
          <div className="input-group flex flex-col items-start gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Enter Username
            </label>
            <input
              type="text"
              id="name"
              name="name"
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
            Register
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-pink-900 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Register
