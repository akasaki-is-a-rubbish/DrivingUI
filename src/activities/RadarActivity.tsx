import React, { useEffect, useState } from 'react';
import { Activity } from './Activity';
import { Camera } from '../Camera';
import { CarView } from '../CarView';
import { Client } from '../Client';
import { useWebfxRef } from '../utils';

export const RadarAndCamsActivity = React.memo(function(props: { hidden: boolean; }) {
  // const data = useWebfxRef(Client.current.data);
  return (
    <Activity className="radar" hidden={props.hidden}>
      {/* <div>Data: <code>{JSON.stringify(data)}</code></div> */}
      <div className="columns">
        <CarView hidden={props.hidden} />
        <SomeCameras />
      </div>
    </Activity>
  );
});

function SomeCameras() {
  const [cameras, setCameras] = useState<string[]>([
    // '99e5e0461eb2d98dcf640ff2ba595363c05dc9b1549da3303c47dac714d08366',
    // '2b3eb2f37f900060e0e8f0d1e8e497109c821fc24f0ae8dc3eef5495123d2ae8'
  ]);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(x => {
        console.info('devices', x);
        setCameras(x.filter(x => x.kind == 'videoinput').map(x => x.deviceId).slice(1, 3));
      }, console.error);
  }, []);
  return (
    <div className="cameras">
      {cameras.map(x => <Camera key={x} device={x} />)}
      {/* <Camera img="res/cam_back.png"></Camera> */}
    </div>
  );
}
