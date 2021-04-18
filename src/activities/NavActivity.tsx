import React from 'react';
import { Activity } from './Activity';

export const NavActivity = React.memo(function(props: { hidden: boolean; }) {
  return (
    <Activity hidden={props.hidden} className={"nav"}>
      <iframe style={{height: '100%', width: '100%'}} src="https://map.baidu.com/" frameBorder="0"></iframe>
    </Activity>
  );
});
