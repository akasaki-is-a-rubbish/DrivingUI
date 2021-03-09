import React, { Ref, useEffect, useRef, useState } from 'react';
import './App.css';
import { CarView } from './CarView';
import { Client } from './Client';

export type Data = any;

function App() {
  const [data, setData] = useState('')
  useEffect(() => {
    return Client.current.listenData(data => {
      setData(JSON.stringify(data));
    });
  })
  return (
    <div className="App">
      <p>Data: <code>{data}</code></p>
      <CarView />
    </div>
  );
}

export default App;
