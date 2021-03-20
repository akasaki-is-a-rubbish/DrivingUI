import React from 'react';

export function Activity(props: React.PropsWithChildren<{className?: string}>) {
  return (
    <div className={"activity " + (props.className || '')}>
      {props.children}
    </div>
  );
}
