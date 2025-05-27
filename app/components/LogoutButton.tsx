import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function LogoutButton() {
  const { isDarkMode } = useAuth()

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      className={`w-10 h-10 rounded-full ${
        isDarkMode 
          ? 'bg-gray-800/60 hover:bg-gray-700/60' 
          : 'bg-purple-800/60 hover:bg-purple-700/60'
      } backdrop-blur-sm flex items-center justify-center transition-colors`}
    >
      <LogOut className="w-4 h-4 text-red-400" />
    </button>
  )
} 