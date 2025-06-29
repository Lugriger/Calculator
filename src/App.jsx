import { useState, useEffect, useCallback } from 'react'
import { evaluate } from 'mathjs'

function App() {
  const [display, setDisplay] = useState('0')
  const [justEvaluated, setJustEvaluated] = useState(false)

  const buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3']

  const handleClick = useCallback((value) => {
    setDisplay((prev) => {
      if (prev.length >= 39) return prev
      const isNumber = /[0-9.]/.test(value)
      const isOperator = /[+\-*/]/.test(value)
      const lastCharacter = prev.slice(-1)

      if (justEvaluated && isNumber) {
        setJustEvaluated(false)
        return value
      }
      if (justEvaluated && !isNumber) {
        setJustEvaluated(false)
        return prev + value
      }
      if (justEvaluated && isOperator) {
        setJustEvaluated(false)
        return prev + value
      }

      if (prev === '0' && isNumber) {
        return value
      }
      if (isOperator && /[+\-*/]/.test(lastCharacter)) {
        return prev.slice(0, -1) + value
      }
      if (value === '.') {
        const lastNumber = prev.split(/[+\-*/]/).pop()
        if (lastNumber.includes('.')) {
          return prev
        }
      }

      return prev + value
    })
  }, [justEvaluated])

  const handleEnter = useCallback(() => {
    try {
      const result = evaluate(display)
      setDisplay(result.toString())
    } catch {
      setDisplay('Error')
    }
    setJustEvaluated(true)
  }, [display])

  const handleClear = () => {
    setDisplay('0')
  }

  const handleBackspace = () => {
    setDisplay((prev) => {
      const newDisplay = prev.slice(0, -1)
      return newDisplay === '' ? '0' : newDisplay
    })
  }

  const handleKeyDown = useCallback(
    (e) => {
      const { key } = e
      if (/[0-9.]/.test(key)) {
        handleClick(key)
      } else if (/[+\-*/]/.test(key)) {
        handleClick(key)
      } else if (key === 'Enter' || key === '=') {
        handleEnter()
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        handleClear()
      } else if (key === 'Backspace' || key === 'Delete') {
        handleBackspace()
      }
    },
    [handleClick, handleEnter]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-screen bg-gradient-to-tl from-amber-400 to-blue-400/80 flex items-center justify-center p-4">
      <div className="border-4 border-black rounded shadow-xl shadow-indigo-900 w-full max-w-md">
        {/* Display */}
        <div className="flex items-end justify-end bg-amber-200/50 text-right p-4 font-bold text-3xl sm:text-5xl border-b-4 border-black h-24 sm:h-40 break-words overflow-x-auto ">
          <div className='w-full text-right'>
            {display}
          </div>
            
        </div>

        {/* Keypad */}
        <div className="bg-black grid grid-cols-4 grid-rows-5 gap-2 p-2 sm:p-4">
          {/* First Row */}
          <button className="text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded" onClick={handleClear}>C</button>
          <button className="text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded" onClick={() => handleClick('/')}>/</button>
          <button className="text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded" onClick={() => handleClick('*')}>*</button>
          <button className="text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded" onClick={() => handleClick('-')}>-</button>

          {/* Number buttons */}
          {buttons.map((button, index) => (
            <button key={index} className="text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded" onClick={() => handleClick(button)}>
              {button}
            </button>
          ))}

          <button className="text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded col-span-2" 
              onClick={() => handleClick('0')}>0</button>
          <button className="text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded" 
              
                  onClick={() => handleClick('.')}>.</button>

          {/* Enter and Plus */}
          <button className=" row-start-2 col-start-4 row-span-2 h-full text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded"
              onClick={() => handleClick('+')}>+</button>
          <button className="row-span-2 row-start-4 col-start-4 text-white text-xl sm:text-2xl border border-white p-2 sm:p-4 hover:bg-blue-400 active:bg-blue-400 focus:outline-none transition-all duration-300 rounded w-full h-full" 
              onClick={handleEnter}>Enter</button>
        </div>
      </div>
    </div>
  )
}

export default App
