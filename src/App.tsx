import React, { Ref, useEffect, useState } from 'react';
import { Activity } from './Basics';
import './App.css';
import { Camera } from './Camera';
import { CarView } from './CarView';
import { Client } from './Client';
import { useWebfxCallback, useWebfxRef } from './utils';

export type Data = any;

function App() {
  // useEffect(() => {
  //   Client.current.connect();
  //   return () => Client.current.close();
  // }, []);

  const connection = useWebfxRef(Client.current.connectionState);

  return (
    <div className="App">
      {connection == 'disconnected' ? <div>(Disconnected)</div> : null}
      <RadarAndCamsActivity />
    </div>
  );
}

function NavBar() {
  <div className="nav-bar">
    
  </div>
}

function RadarAndCamsActivity() {
  const data = useWebfxRef(Client.current.data);
  return (
    <Activity className="radar">
      <div>Data: <code>{JSON.stringify(data)}</code></div>
      <div className="columns">
        <CarView />
        <SomeCameras />
      </div>
    </Activity>
  );
}

function SomeCameras() {
  const [cameras, setCameras] = useState<string[]>([]);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(x => {
        console.info('devices', x);
        setCameras(x.filter(x => x.kind == 'videoinput').map(x => x.deviceId));
      }, console.error);
  }, []);
  return (
    <div className="cameras">
      {cameras.map(x => <Camera device={x} />)}
    </div>
  );
}

export default App;
