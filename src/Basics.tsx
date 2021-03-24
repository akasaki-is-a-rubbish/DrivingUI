import React from 'react';
import { className } from './utils';

export function Activity(props: React.PropsWithChildren<{ className?: string, hidden: boolean; }>) {
  return (
    <div className={className(["activity", props.className])} hidden={props.hidden}>
      {props.children}
    </div>
  );
}
