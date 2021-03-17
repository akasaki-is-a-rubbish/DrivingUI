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
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
    .then(x => console.info('devices', x), console.error);
  }, []);
  return (
    <div className="cameras">
      <Camera device='ca22de068fe6c751104b4118492296154e0705722e533418cc48cc8d4aaf88ba' />
      <Camera device='f5b3ec5219dd18aee5c35b3e49126d58b66cc26a0bbc35404849228498b158b2' />
    </div>
  );
}

export default App;
