import { Moon, Sun } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useAuth()

  return (
    <button
      onClick={toggleDarkMode}
      className={`w-10 h-10 rounded-full ${
        isDarkMode 
          ? 'bg-gray-800/60 hover:bg-gray-700/60' 
          : 'bg-purple-800/60 hover:bg-purple-700/60'
      } backdrop-blur-sm flex items-center justify-center transition-colors`}
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4 text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4 text-purple-200" />
      )}
    </button>
  )
} 