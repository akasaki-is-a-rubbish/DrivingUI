import React, { Ref, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLImageElement | null>(null);

  return (
    <div className="App">
      <p>Hello, the vehicle!</p>
    </div>
  )
}

export default App
