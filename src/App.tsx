import React, { Ref, useEffect, useState } from 'react';
import './App.css';
import { Camera } from './Camera';
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
      <div>Data: <code>{JSON.stringify(data)}</code></div>
      {connection == 'disconnected' ? <div>(Disconnected)</div> : null}
      <div className="columns">
        <CarView />
        <SomeCameras />
      </div>
    </div>
  );
}

function SomeCameras() {
  return (
    <div className="cameras">
      <Camera device='/dev' />
      <Camera device='/dev' />
    </div>
  );
}

export default App;
