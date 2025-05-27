'use client'

import React, { useState, useEffect } from 'react'
import { Menu, FileText, HelpCircle, Users, Heart, Share2, Send } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from './hooks/useAuth'
import { DarkModeToggle } from './components/DarkModeToggle'
import { LogoutButton } from './components/LogoutButton'
import { TutorResponse } from './components/TutorResponse'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/LoadingSpinner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AIPersonalTutor() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showHero, setShowHero] = useState(true)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, isDarkMode } = useAuth()

  // Hide hero section after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHero(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      setIsLoading(true)
      setError(null)

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input.trim()
      }
      setMessages(prev => [...prev, userMessage])
      setInput('')

      // Send to API with retry logic
      let retries = 3
      let response

      while (retries > 0) {
        try {
          response = await fetch('/api/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: input.trim() }),
          })

          if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment and try again.')
          }

          if (!response.ok) {
            throw new Error('Failed to get response')
          }

          break
        } catch (err) {
          retries--
          if (retries === 0) throw err
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      if (!response) {
        throw new Error('Failed to get response after all retries')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.aiResponse
      }
      setMessages(prev => [...prev, assistantMessage])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `[ERROR] ${err instanceof Error ? err.message : 'An error occurred'}`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 ${isMobileMenuOpen ? 'h-auto' : 'h-16'} sm:h-16 ${isDarkMode ? 'bg-gray-900/80' : 'bg-purple-950/80'} backdrop-blur-md z-50 border-b ${isDarkMode ? 'border-gray-700/20' : 'border-white/5'} transition-all duration-300`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-0">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 'bg-gradient-to-br from-amber-400 to-amber-500'} flex items-center justify-center text-sm font-bold ${isDarkMode ? 'text-gray-900' : 'text-purple-900'}`}>
                  PT
                </div>
                <span className="text-white/90 tracking-wider font-medium">PERSONAL TUTOR</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-white/10"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Mobile Menu */}
            <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:hidden flex-col w-full space-y-2 mt-4 sm:mt-0`}>
              {user?.role === 'user' && (
                <a 
                  href="/upload" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/60' : 'bg-purple-800/60 text-purple-200 hover:bg-purple-700/60'} backdrop-blur-sm transition-colors`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Upload Learning Material</span>
                </a>
              )}
              {activeIndex && user?.role === 'user' && (
                <Link 
                  href="/practice-quiz" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-700/70 text-blue-100 hover:bg-blue-600/70' : 'bg-amber-600/70 text-amber-100 hover:bg-amber-500/70'} backdrop-blur-sm transition-colors`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Practice Quiz</span>
                </Link>
              )}
              {user?.role === 'admin' && (
                <a 
                  href="/admin/dashboard" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-800/60 text-blue-200 hover:bg-blue-700/60' : 'bg-indigo-800/60 text-indigo-200 hover:bg-indigo-700/60'} backdrop-blur-sm transition-colors`}
                >
                  <Users className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </a>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
              <DarkModeToggle />
              {user?.role === 'user' && (
                <a 
                  href="/upload" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/60' : 'bg-purple-800/60 text-purple-200 hover:bg-purple-700/60'} backdrop-blur-sm transition-colors`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Upload Learning Material</span>
                </a>
              )}
              {activeIndex && user?.role === 'user' && (
                <Link 
                  href="/practice-quiz" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-blue-700/70 text-blue-100 hover:bg-blue-600/70' : 'bg-amber-600/70 text-amber-100 hover:bg-amber-500/70'} backdrop-blur-sm transition-colors`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Practice Quiz</span>
                </Link>
              )}
              {user?.role === 'admin' && (
                <a 
                  href="/admin/dashboard" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-blue-800/60 text-blue-200 hover:bg-blue-700/60' : 'bg-indigo-800/60 text-indigo-200 hover:bg-indigo-700/60'} backdrop-blur-sm transition-colors`}
                >
                  <Users className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </a>
              )}
              <button className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-800/60 hover:bg-gray-700/60' : 'bg-purple-800/60 hover:bg-purple-700/60'} backdrop-blur-sm flex items-center justify-center transition-colors`}>
                <Heart className="w-4 h-4" />
              </button>
              <button className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-800/60 hover:bg-gray-700/60' : 'bg-purple-800/60 hover:bg-purple-700/60'} backdrop-blur-sm flex items-center justify-center transition-colors`}>
                <Share2 className="w-4 h-4" />
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-red-900/90 text-red-100' : 'bg-red-100 text-red-900'
          }`}>
            {error}
          </div>
        </div>
      )}

      {/* Hero Section with Animation */}
      <div
        className={`transition-all duration-700 ease-out ${
          showHero 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-8 absolute'
        }`}
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl mx-auto px-6">
            <div className={`${isDarkMode ? 'text-blue-400' : 'text-purple-400'} text-sm tracking-wider animate-fade-in`}>
              YOUR PERSONAL AI TUTOR
            </div>
            <h1 className={`text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-white to-blue-300' : 'bg-gradient-to-r from-white to-purple-300'} animate-slide-up`}>
              <div className="animate-slide-up-delay-1">LEARN</div>
              <div className="animate-slide-up-delay-2">SMARTER</div>
            </h1>
            <div className={`${isDarkMode ? 'text-blue-400' : 'text-purple-400'} text-sm tracking-wider animate-fade-in-delay`}>
              POWERED BY ADVANCED AI
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages with Animation */}
      <div 
        className={`px-4 sm:px-6 transition-all duration-700 ease-out ${
          showHero 
            ? 'opacity-0 translate-y-8' 
            : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="max-w-4xl mx-auto pt-24 pb-32">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`mb-4 sm:mb-8 animate-slide-up ${
                message.role === 'assistant' 
                  ? 'flex justify-start' 
                  : 'flex justify-end'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`rounded-2xl max-w-[90%] sm:max-w-[85%] ${
                  message.role === 'assistant'
                    ? isDarkMode 
                      ? 'bg-gray-800/40 border border-gray-700/30' 
                      : 'bg-purple-800/40 border border-purple-500/20'
                    : isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                } p-4 sm:p-6 animate-fade-in`}
              >
                {message.role === 'assistant' ? (
                  <TutorResponse content={message.content} />
                ) : (
                  <div className="text-base sm:text-lg leading-relaxed">
                    {message.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && <LoadingSpinner />}
        </div>
      </div>

      {/* Input Form with Animation */}
      <form 
        onSubmit={handleSubmit}
        className={`fixed bottom-0 left-0 right-0 p-4 sm:p-6 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/70 border-gray-700/20' 
            : 'bg-gradient-to-t from-purple-950 via-purple-950/95 to-purple-950/70 border-white/5'
        } backdrop-blur-md z-50 border-t transition-all duration-500 ease-out animate-slide-up`}
      >
        <div className="max-w-4xl mx-auto flex gap-2 sm:gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI tutor a question..."
            className={`flex-1 ${
              isDarkMode 
                ? 'bg-gray-800/30 placeholder-gray-400/50 focus:ring-blue-500/50 focus:bg-gray-800/40 border-gray-700' 
                : 'bg-purple-800/30 placeholder-purple-300/50 focus:ring-purple-500/50 focus:bg-purple-800/40 border-purple-700'
            } backdrop-blur-md rounded-full px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg text-white focus:outline-none focus:ring-2 transition-all border`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-4 sm:px-6 py-3 sm:py-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
            } rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg flex items-center gap-2`}
            disabled={isLoading}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">SUBMIT</span>
          </button>
        </div>
      </form>
    </ErrorBoundary>
  )
} 