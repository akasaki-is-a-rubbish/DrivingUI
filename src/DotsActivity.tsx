import React from 'react';
import { Activity } from './Basics';

export function DotsActivity(props: { hidden: boolean; }) {
  return (
    <Activity hidden={props.hidden}>
      ...
    </Activity>
  );
}
