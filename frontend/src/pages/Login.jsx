import { useState } from 'react'
import apiClient from '../api/client'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e)=>{
        e.preventDefault();
        setError('')
        setIsLoading(true)

        try{
            const response = await apiClient.post("/login", {username, password})
            localStorage.setItem("token", response.data.access_token);
            navigate("/dashboard")
        }catch(err){
            if (err.response?.status === 401){
                setError("Invalid username or password. Please try again.")
            }else{
                setError("Unable to connect with server, try again later.")
            }
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <div className='flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>Welcome back</h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
            Sign in to access your dashboard.
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100'>
            <form className='space-y-6' onSubmit={handleLogin}>
                {error && (
                    <div className='bg-red-50 border-l-4 border-red-400 p-4'>
                        <div className='flex'>
                            <div className='ml-3'>
                                <p className='text-sm text-red-700'>{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className='block text-sm font-medium text-gray-700'>Username</label>
                    <div className='mt-1'>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700'>Password</label>
                    <div className='mt-1'>
                        <input
                            type='password'
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors'
                        />
                    </div>
                </div>

                <div>
                    <button
                        type='submit'
                        disabled={isLoading}
                        className='flex w-full justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-wait'
                    >
                        {isLoading ? "Signing in...": "Sign in"}
                    </button>
                </div>

                <div className='text-center text-sm text-gray-600'>
                    Don't have an account? <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">Sign up here</Link>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Login
