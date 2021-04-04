import React, { useEffect, useState } from 'react';
import { Activity } from './Activity';
import { Camera } from '../Camera';
import { CarView } from '../CarView';
import { Client } from '../Client';
import { useWebfxRef } from '../utils';

export function RadarAndCamsActivity(props: { hidden: boolean; }) {
  const data = useWebfxRef(Client.current.data);
  return (
    <Activity className="radar" hidden={props.hidden}>
      {/* <div>Data: <code>{JSON.stringify(data)}</code></div> */}
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
      {cameras.map(x => <Camera key={x} device={x} />)}
    </div>
  );
}
