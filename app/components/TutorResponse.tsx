'use client'

import React from 'react'
import { useAuth } from '../hooks/useAuth'

interface TutorResponseProps {
  content: string
}

export const TutorResponse: React.FC<TutorResponseProps> = ({ content }) => {
  const { isDarkMode } = useAuth()

  // Split content into paragraphs and format with proper styling
  const paragraphs = content.split('\n').filter(p => p.trim())

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p 
          key={index}
          className={`text-base sm:text-lg leading-relaxed ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
} 