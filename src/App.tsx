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
  { name: 'rac', friendlyName: '撞车', activity: RadarAndCamsActivity, icon: Sensors },
  { name: 'front', friendlyName: '开车', activity: FrontActivity, icon: Camera },
  { name: 'lidar', friendlyName: '雷达', activity: LidarActivity, icon: LocationOn },
  { name: 'music', friendlyName: '音乐', activity: MusicActivity, icon: MusicNote },
] as const;
type ActivityName = (typeof activities)[number]['name'];

function App() {
  const [navStateRef] = useState(() => Object.assign(new webfx.Ref<ActivityName>(), { value: 'music' }));
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
            <x.activity hidden={navState != x.name} />
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
          <BottomNavigationAction label={x.friendlyName} value={x.name} icon={<x.icon />} />
        )
      }
    </BottomNavigation>
  );
}

export default App;
