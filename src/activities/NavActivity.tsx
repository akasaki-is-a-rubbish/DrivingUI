import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Activity, createActivity } from './Activity';

export const NavActivity = createActivity(function (props) {
  const [inited, setInited] = useState(false);
  useEffect(() => {
    if (!inited && !props.hidden) {
      setInited(true);
    }
  }, [props.hidden, inited])
  return (
    <Activity hidden={props.hidden} className={"nav"}>
      {inited
        ? <iframe style={{ height: '100%', width: '100%' }}
          src="https://map.baidu.com/@12958568.790375967,4827154.440323783,14.47z"
          frameBorder="0"></iframe>
        : null
      }
    </Activity>
  );
});
