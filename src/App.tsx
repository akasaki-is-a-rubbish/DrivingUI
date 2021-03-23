import React, { Ref, useEffect, useState } from 'react';
import './App.css';
import { Client } from './Client';
import { useWebfxCallback, useWebfxRef } from './utils';
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import RadarIcon from "@material-ui/icons/FindInPage";
import LocationOn from "@material-ui/icons/LocationOn";
import MusicNote from "@material-ui/icons/MusicNote";
import * as webfx from "@yuuza/webfx";
import { RadarAndCamsActivity } from './RadarActivity';
import { MusicActivity } from './MusicActivity';
import { LidarActivity } from './LidarActivity';
import { FrontActivity } from './FrontActivity';

export type Data = any;

function App() {
  const [navStateRef] = useState(() => Object.assign(new webfx.Ref<NavValue>(), { value: 'rac' }));
  const navState = useWebfxRef(navStateRef);
  useEffect(() => {
    Client.current.connect();
    return () => Client.current.close();
  }, []);

  const connection = useWebfxRef(Client.current.connectionState);
  let curActivity: JSX.Element = null!;

  // if (navState == 'rac')
  //   curActivity = ;

  return (
    <div className="App">
      {/* {connection == 'disconnected' ? <div>(Disconnected)</div> : null} */}
      <div className="activity-outer">
        <RadarAndCamsActivity hidden={navState != 'rac'} />
        <MusicActivity hidden={navState != 'music'} />
        <LidarActivity hidden={navState != 'lidar'} />
        <FrontActivity hidden={navState != 'front'} />
      </div>
      <NavBar valRef={navStateRef} />
    </div>
  );
}

const navs = ['rac', 'front', 'lidar', 'music' ] as const;
type NavValue = (typeof navs)[number];

function NavBar(props: { valRef: webfx.Ref<NavValue>; }) {
  const val = useWebfxRef(props.valRef);
  return (
    <BottomNavigation value={val} onChange={(e, newval) => {
      props.valRef.value = newval;
    }} className="my-navbar">
      <BottomNavigationAction label="雷达" value="rac" icon={<RadarIcon />} />
      {/* TODO: */}
      <BottomNavigationAction label="Front" value="front" icon={<Favorite />} />
      <BottomNavigationAction label="Lidar" value="lidar" icon={<LocationOn />} />

      <BottomNavigationAction label="音乐" value="music" icon={<MusicNote />} />
    </BottomNavigation>
  );
}

export default App;
