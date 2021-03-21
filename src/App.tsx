import React, { Ref, useState } from 'react';
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

export type Data = any;

function App() {
  const [navStateRef] = useState(() => Object.assign(new webfx.Ref<string>(), { value: 'rac' }));
  const navState = useWebfxRef(navStateRef);
  // useEffect(() => {
  //   Client.current.connect();
  //   return () => Client.current.close();
  // }, []);

  const connection = useWebfxRef(Client.current.connectionState);
  let curActivity: JSX.Element = null!;

  // if (navState == 'rac')
  //   curActivity = ;

  return (
    <div className="App">
      {/* {connection == 'disconnected' ? <div>(Disconnected)</div> : null} */}
      <RadarAndCamsActivity hidden={navState != 'rac'} />
      <MusicActivity hidden={navState != 'music'} />
      <NavBar valRef={navStateRef} />
    </div>
  );
}

function NavBar(props: { valRef: webfx.Ref<string>; }) {
  const val = useWebfxRef(props.valRef);
  return (
    <BottomNavigation value={val} onChange={(e, newval) => {
      props.valRef.value = newval;
    }} className="my-navbar">
      <BottomNavigationAction label="R" value="rac" icon={<RadarIcon />} />
      <BottomNavigationAction label="Music" value="music" icon={<MusicNote />} />
      {/* <BottomNavigationAction label="Favorites" value="a2" icon={<Favorite />} />
      <BottomNavigationAction label="Nearby" value="a3" icon={<LocationOn />} /> */}
    </BottomNavigation>
  );
}

export default App;
