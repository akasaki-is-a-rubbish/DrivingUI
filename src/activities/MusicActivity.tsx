import React, { useMemo } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { appTheme } from '../appTheme';
import { useWebfxRef } from '../utils';
import { Activity, createActivity } from './Activity';

export const MusicActivity = createActivity(function (props) {
  const iframe = useRef<HTMLIFrameElement>(null!);
  useEffect(() => {
    iframe.current.contentWindow?.postMessage({
      theme: appTheme.enabledRef.value ? 'dark' : 'light'
    }, '*');
  }, [useWebfxRef(appTheme.enabledRef), iframe.current])
  return (
    <Activity hidden={props.hidden} className={"music"}>
      <iframe ref={iframe} style={{height: '100%', width: '100%'}} src={"./mc/index.html?time=" + useMemo(() => Date.now(), [])} frameBorder="0"></iframe>
    </Activity>
  );
});
