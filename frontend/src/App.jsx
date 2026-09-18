import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Signup from './pages/Signup'

function Navigation(){
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/")
  }

  return(
    <nav className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link to="/" className='text-xl font-bold text-emerald-600 tracking-tight'>Darukaa.Earth</Link>
          </div>
          <div className='flex items-center space-x-4'>
            {token ? (
              <>
                <Link to="/dashboard" className='text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'>Dashboard</Link>
                <button onClick={handleLogout} className='bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-md text-sm font-medium transition-colors'>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className='text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'>Login</Link>
                <Link to="/signup" className='bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm'>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

const PrivateRoute = ({children})=>{
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/" />
}

function App() {

  return (
    <BrowserRouter>
      <div className='min-h-screen bg-gray-50 flex flex-col font-sans'>
        <Navigation/>
        <main className='flex-1 w-full mx-auto'>
          <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route 
              path='/dashboard'
              element={
                <PrivateRoute>
                  <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
                    <Dashboard/>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
