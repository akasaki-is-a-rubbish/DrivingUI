import React from 'react';
import { Activity, createActivity } from './Activity';

export const MusicActivity = createActivity(function (props) {
  return (
    <Activity hidden={props.hidden} className={"music"}>
      <iframe style={{height: '100%', width: '100%'}} src={"./MusicCloud/index.html?time=" + Date.now()} frameBorder="0"></iframe>
    </Activity>
  );
});
