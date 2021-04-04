import React from 'react';
import { Activity } from './Activity';

export function MusicActivity(props: { hidden: boolean; }) {
  return (
    <Activity hidden={props.hidden} className={"music"}>
      <iframe style={{height: '100%', width: '100%'}} src="./MusicCloud/index.html" frameBorder="0"></iframe>
    </Activity>
  );
}
