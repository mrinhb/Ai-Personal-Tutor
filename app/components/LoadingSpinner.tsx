'use client'

import React from 'react'
import { useAuth } from '../hooks/useAuth'

export const LoadingSpinner: React.FC = () => {
  const { isDarkMode } = useAuth()

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`animate-spin rounded-full h-8 w-8 border-4 ${
        isDarkMode 
          ? 'border-gray-300 border-t-blue-500' 
          : 'border-gray-200 border-t-purple-500'
      }`} />
    </div>
  )
} 