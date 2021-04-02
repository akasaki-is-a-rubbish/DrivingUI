import React, { Ref, useEffect, useState } from 'react';
import './App.css';
import { Client } from './Client';
import { className, useWebfxCallback, useWebfxRef } from './utils';
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import * as webfx from "@yuuza/webfx";
import { Sensors, Camera, LocationOn, MusicNote } from "./icons";
import { RadarAndCamsActivity } from './RadarActivity';
import { MusicActivity } from './MusicActivity';
import { LidarActivity } from './LidarActivity';
import { FrontActivity } from './FrontActivity';
import { fakeScreen } from './config';

const activities = [
  { key: 'rac', friendlyName: '撞车', activity: RadarAndCamsActivity, icon: Sensors },
  { key: 'front', friendlyName: '开车', activity: FrontActivity, icon: Camera },
  { key: 'lidar', friendlyName: '雷达', activity: LidarActivity, icon: LocationOn },
  { key: 'music', friendlyName: '音乐', activity: MusicActivity, icon: MusicNote },
] as const;
type ActivityName = (typeof activities)[number]['key'];

function App() {
  const [navStateRef] = useState(() => Object.assign(new webfx.Ref<ActivityName>(), { value: 'front' }));
  const navState = useWebfxRef(navStateRef);
  useEffect(() => {
    Client.current.connect();
    return () => Client.current.close();
  }, []);

  const connection = useWebfxRef(Client.current.connectionState);

  return (
    <div className={className("App", { fakeScreen })}>
      {/* {connection == 'disconnected' ? <div>(Disconnected)</div> : null} */}
      <div className="activity-outer">
        {
          activities.map(x =>
            <x.activity key={x.key} hidden={navState != x.key} />
          )
        }
      </div>
      <NavBar valRef={navStateRef} />
    </div>
  );
}

function NavBar(props: { valRef: webfx.Ref<ActivityName>; }) {
  const val = useWebfxRef(props.valRef);
  return (
    <BottomNavigation value={val} showLabels={true} onChange={(e, newval) => {
      props.valRef.value = newval;
    }} className="my-navbar">
      {
        activities.map(x =>
          <BottomNavigationAction key={x.key} label={x.friendlyName} value={x.key} icon={<x.icon />} />
        )
      }
    </BottomNavigation>
  );
}

export default App;
