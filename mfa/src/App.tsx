import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from './context/ThemeContext'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import Authenticate from './components/MFA/Authenticate'
import { useAuth } from './context/AuthContext'
import { useEffect } from 'react'

function App() {
  const { theme, toggleTheme } = useTheme();

  const { token, user, isAuthenticated } = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (!token || !user) navigator('/login')
    }

  }, [token, user, isAuthenticated])
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/mfa' element={<Authenticate />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      <div className="fixed top-0 right-0 p-6">
        <Switch
          id='theme-mode'
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
          aria-readonly
        />
        <Label>{theme}</Label>
      </div>
      <Toaster position='top-center' reverseOrder={false} />
    </>
  )
}

export default App
