'use client'

import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface MCQQuizProps {
  questions: MCQQuestion[];
  onClose: () => void;
}

const MCQQuiz: React.FC<MCQQuizProps> = ({ questions, onClose }) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const { isDarkMode } = useAuth();

  // Handle close and navigate to home page
  const handleClose = () => {
    onClose(); // Call the original onClose function
    router.push('/'); // Navigate to home page
  };

  // Handle option selection
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    setSelectedAnswer(answer);
    setShowExplanation(true);
    setIsTimerActive(false);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  // Move to next question or finish quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(20);
      setIsTimerActive(true);
    } else {
      // Quiz complete
      setQuizCompleted(true);
    }
  };

  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(20);
      setIsTimerActive(true);
    }
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(20);
    setIsTimerActive(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  // Quiz completion screen
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-900/90' : 'bg-purple-950/90'} rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto border ${isDarkMode ? 'border-gray-800/50' : 'border-purple-800/50'}`}>
          <h2 className={`text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 ${isDarkMode ? 'text-blue-300' : 'text-purple-300'}`}>Quiz Completed!</h2>
          
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className={`text-5xl sm:text-6xl font-bold mb-2 ${
              percentage >= 80 ? 'text-green-500' : 
              percentage >= 60 ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {percentage}%
            </div>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-blue-200' : 'text-purple-200'}`}>
              You scored {score} out of {questions.length} questions
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button 
              onClick={handleRestartQuiz}
              className={`px-4 sm:px-6 py-2 sm:py-3 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'} text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2`}
            >
              <RotateCcw className="w-4 h-4" />
              Restart Quiz
            </button>
            <button 
              onClick={handleClose}
              className={`px-4 sm:px-6 py-2 sm:py-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-700 hover:bg-purple-600'} text-white rounded-xl font-medium transition-colors`}
            >
              Close Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Current question from the quiz
  const question = questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-900/90' : 'bg-purple-950/90'} rounded-2xl p-6 sm:p-8 w-full max-w-2xl mx-auto border ${isDarkMode ? 'border-gray-800/50' : 'border-purple-800/50'}`}>
        {/* Quiz header with progress */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
          <div className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-purple-300'}`}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-purple-300'}`}>
            Time left: {timeLeft}s
          </span>
          <button 
            onClick={handleClose}
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-purple-400 hover:text-purple-300'} transition-colors`}
          >
            Close Quiz
          </button>
        </div>
        
        {/* Progress bar */}
        <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-purple-800'} rounded-full mb-4 sm:mb-6`}>
          <div 
            className={`h-full ${isDarkMode ? 'bg-blue-600' : 'bg-amber-500'} rounded-full`}
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Question */}
        <h3 className="text-lg sm:text-xl font-medium text-white mb-4 sm:mb-6">
          {question.question}
        </h3>
        
        {/* Options */}
        <div className="space-y-2 sm:space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const showResult = selectedAnswer && (isSelected || isCorrect);

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={!!selectedAnswer}
                className={`w-full p-3 sm:p-4 text-left rounded-lg transition-all ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-500/20 border-green-500'
                      : isSelected
                      ? 'bg-red-500/20 border-red-500'
                      : `${isDarkMode ? 'bg-gray-800/60' : 'bg-purple-800/60'} border-transparent`
                    : isSelected
                    ? `${isDarkMode ? 'bg-blue-500/20 border-blue-500' : 'bg-amber-500/20 border-amber-500'}`
                    : `${isDarkMode ? 'bg-gray-800/60 hover:bg-gray-700/60' : 'bg-purple-800/60 hover:bg-purple-700/60'} border-transparent`
                } border-2 flex items-center justify-between`}
              >
                <span className="text-sm sm:text-base text-white/90">{option}</span>
                {showResult && (
                  <span className="text-white">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MCQQuiz; 