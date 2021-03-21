import React from 'react';
import { Activity } from './Basics';

export function MusicActivity(props: { hidden: boolean; }) {
  return (
    <Activity hidden={props.hidden}>
      <iframe style={{height: '100%'}} src="https://mc.yuuza.net/#list/1" frameBorder="0"></iframe>
    </Activity>
  );
}
