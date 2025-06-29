
import {  useState, useEffect } from 'react'

import { evaluate } from 'mathjs'

function App() {

  const [display, setDisplay] = useState('0')
  const [justEvaluated, setJustEvaluated] = useState(false);

  const buttons = [
    "7","8","9",
    "4","5","6",
    "1","2","3",
    
  ]
  
  const handleClick = (value) => {
    setDisplay((prev) => {
      const isNumber = /[0-9.]/.test(value);
      const isOperator = /[+\-*/]/.test(value);
      const lastCharacter = prev.slice(-1);


      if (justEvaluated && isNumber) {
        setJustEvaluated(false);
        return value;
      }

      if (justEvaluated && !isNumber) {
        setJustEvaluated(false);
        return prev + value;
      }
      if (justEvaluated && isOperator) {
        setJustEvaluated(false);
        return prev + value;
      }

      if (prev === '0' && isNumber) {
        return value;
      }
      if (isOperator && /[+\-*/]/.test(lastCharacter)){
        return prev.slice(0, -1);
      }
      if (value ==='.') {
        const lastNumber = prev.split(/[+\-*/]/).pop();
        if (lastNumber.includes('.')) {
          return prev;}
      }

      return prev + value;
    })
  }

  const handleEnter = () => {
    try {
      const result = evaluate(display);
      setDisplay(result.toString());
      setJustEvaluated(true);
    } catch{
      setDisplay("Error")
     
    }
    setJustEvaluated(true);
  }
  const handleClear = () => {
    setDisplay("0");
  }

  const handleBackspace = () => {
    setDisplay(prev => prev.slice(0, -1))
  }
  

  const handleKeyDown = (e) => {
    const {key} = e;
      if ( /[0-9.]/.test(key)) {
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
  }

  


  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  return(
    <>
      <div className="flex items-center min-h-screen justify-center flex-col  bg-amber-400 to-20% bg-gradient-to-tl  to-blue-400/80">
        <div className="border-black-400 border-4 rounded shadow-xl shadow-indigo-900">
          <div className=" text-right flex backdrop-brightness-75 items-end justify-end border-b-4 font-bold border-black-400 w-96 h-40 text-4xl">
            <div className=' w-full text-right break-words text-gray-900'>
              {display}
            </div>
            
          </div>
          <div className="flex justify-center w-96 h-96 ">
            <div className="bg-black w-full h-full">
              
              <div className="grid grid-cols-4 grid-rows-5 h-full">
                  
                  <button className="text-white border  hover:bg-blue-400" onClick={(handleClear)}>C</button>
                  <button className="text-white border  hover:bg-blue-400 " onClick={() => handleClick("/")}>/</button>
                  <button className='text-white border  hover:bg-blue-400' onClick={() => handleClick("*")}>*</button>
                  <button className='text-white border  hover:bg-blue-400' onClick={() => handleClick("-")}>-</button>
                
                  
              {buttons.map((button, index)=> (
                
                  <button key={index} className="text-white border hover:bg-blue-400" onClick={() => handleClick(button)}>{button}</button>
                
                
              ))}
                  <button className='text-white border  hover:bg-blue-400 col-span-2 row-start-5' onClick={() => handleClick('0')}>0</button>
                  <button className='text-white border  hover:bg-blue-400 row-start-5' onClick={() => handleClick('.')}>.</button>
                  <button className="text-white border  hover:bg-blue-400 row-span-3 col-start-4" onClick={(handleEnter)}>Enter</button>
                  <button className="text-white border  hover:bg-blue-400 row-start-2 col-start-4 row-span-2" onClick={() => handleClick('+')}>+</button>
              </div>

            </div>
          </div>
          </div>
          
      </div>
      
      
    </>
  )
}

export default App