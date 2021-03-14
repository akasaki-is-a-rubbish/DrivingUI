import React, { Ref, useEffect, useRef, useState } from 'react';
import './App.css';
import { CarView } from './CarView';
import { Client } from './Client';
import { useWebfxCallback, useWebfxRef } from './utils';

export type Data = any;

function App() {
  const data = useWebfxRef(Client.current.data);
  const connection = useWebfxRef(Client.current.connectionState);

  useEffect(() => {
    Client.current.connect();
    return () => Client.current.close();
  }, []);

  return (
    <div className="App">
      <p>Data: <code>{data}</code></p>
      {connection == 'disconnected' ? <p>(Disconnected)</p> : null}
      <CarView />
    </div>
  );
}

export default App;
