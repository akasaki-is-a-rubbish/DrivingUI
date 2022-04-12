import React, { Ref, useEffect, useState } from 'react';
import './App.css';
import { Client } from './Client';
import { className, useWebfxCallback, useWebfxRef } from './utils';
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import * as webfx from "@yuuza/webfx";
import { fakeScreen } from './config';
import { activities, ActivityName, defaultActivitiy } from './activities';
import { appTheme } from './appTheme';
import { navContext } from './contexts';

appTheme.init();

function App() {
  // The Ref of (router) navigation state is created here.
  const [navStateRef] = useState(() => Object.assign(new webfx.Ref<ActivityName>(), { value: defaultActivitiy }));

  // Use `useWebfxRef()` to get the value of Ref in React function component.
  const navState = useWebfxRef(navStateRef);

  // The singleton Client is initialized here.
  useEffect(() => {
    Client.current.connect();
    Client.current.onOpen.add(() => {
      if (!Client.current.remoteServer)
        Client.current.sendJson({
          cmd: 'videoEnabled',
          value: true,
        })
    })
    return () => Client.current.close();
  }, []);

  // Initializing app theme
  useEffect(() => {
    var keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key == 'd') {
        e.preventDefault();
        appTheme.toggle();
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, []);

  // const connection = useWebfxRef(Client.current.connectionState);

  return (
    <navContext.Provider value={navStateRef}>
      <div className={className("App", { fakeScreen })}>
        {/* {connection == 'disconnected' ? <div>(Disconnected)</div> : null} */}
        <div className="activity-outer">
          {
            activities.map(x =>
              <x.activity key={x.key} hidden={navState != x.key} navState={navStateRef} />
            )
          }
        </div>
        <NavBar valRef={navStateRef} />
        {/* <Snackbar elevation={6} variant="filled" /> */}
      </div>
    </navContext.Provider>
  );
}

/** The global fixed navigation bar */
function NavBar(props: { valRef: webfx.Ref<ActivityName>; }) {
  const val = useWebfxRef(props.valRef);
  return (
    <BottomNavigation value={val} showLabels={true} onChange={(e, newval) => {
      props.valRef.value = newval;
    }} className="my-navbar">
      {
        activities
          .filter(x => x.inBar)
          .map(x =>
            <BottomNavigationAction key={x.key} label={x.friendlyName} value={x.key} icon={<x.icon />} />
          )
      }
    </BottomNavigation>
  );
}

export default App;
