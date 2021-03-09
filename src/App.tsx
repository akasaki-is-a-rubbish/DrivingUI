import React, { Ref, useEffect, useRef, useState } from 'react';
import './App.css';
import { CarView } from './CarView';
import { Client } from './Client';

export type Data = any;

function App() {
  return (
    <div className="App">
      <CarView />
    </div>
  );
}

export default App;
