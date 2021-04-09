import React, { Ref, useEffect, useState } from 'react';
import './App.css';
import { Client } from './Client';
import { className, useWebfxCallback, useWebfxRef } from './utils';
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import * as webfx from "@yuuza/webfx";
import { fakeScreen } from './config';
import { activities, ActivityName, defaultActivitiy } from './activities';

import * as darkreader from "darkreader";


function App() {
  const [navStateRef] = useState(() => Object.assign(new webfx.Ref<ActivityName>(), { value: defaultActivitiy }));
  const navState = useWebfxRef(navStateRef);
  useEffect(() => {
    Client.current.connect();
    return () => Client.current.close();
  }, []);

  useEffect(() => {
    if (!(darkreader as any).isEnabled()) {
      darkreader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10
      });
    }
  }, [])

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
