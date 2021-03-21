import React from 'react';

export function Activity(props: React.PropsWithChildren<{ className?: string, hidden: boolean; }>) {
  return (
    <div className={"activity " + (props.className || '')} hidden={props.hidden}>
      {props.children}
    </div>
  );
}
