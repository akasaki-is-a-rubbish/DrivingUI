import { Ref } from '@yuuza/webfx';
import React from 'react';
import { className } from '../utils';
import { ActivityName } from "./index";

export type ActivityProps = { hidden: boolean; };

export function Activity(props: React.PropsWithChildren<ActivityProps & { className: string }>) {
  return (
    <div className={className(["activity", props.className])} hidden={props.hidden}>
      {props.children}
    </div>
  );
}

export function createActivity(func: (props: ActivityProps & { navState: Ref<any>; }) => JSX.Element): React.MemoExoticComponent<(props: ActivityProps & { navState: Ref<any>; }) => JSX.Element> {
  return React.memo(func);
}
