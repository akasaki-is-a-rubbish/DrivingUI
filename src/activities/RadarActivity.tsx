import React, { useEffect, useState } from 'react';
import { Activity, createActivity } from './Activity';
import { Camera } from '../components/Camera';
import { TopDownView } from '../components/TopDownView';
import { Client } from '../Client';
import { arrayPick, useWebfxRef } from '../utils';
import { radarCameras } from '../config';

export const RadarAndCamsActivity = createActivity(function (props) {
  // const data = useWebfxRef(Client.current.data);
  return (
    <Activity className="radar" hidden={props.hidden}>
      {/* <div>Data: <code>{JSON.stringify(data)}</code></div> */}
      <div className="columns">
        <TopDownView hidden={props.hidden} />
        <SomeCameras />
      </div>
    </Activity>
  );
});

function SomeCameras() {
  const [cameras, setCameras] = useState<string[]>([]);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(x => {
        console.info('devices', x);
        setCameras(
          arrayPick(
            x.filter(x => x.kind == 'videoinput')
              .map(x => x.deviceId)
            , radarCameras
          )
          .filter(x => !!x)
        );
      }, console.error);
  }, [radarCameras]);
  console.info({ cameras })
  return (
    <div className="cameras">
      {cameras.map(x => <Camera key={x} device={x} maxHeight={(100 / cameras.length) + '%'} />)}
      {/* <Camera img="res/cam_back.png"></Camera> */}
    </div>
  );
}
