import React from 'react';
import { Activity, createActivity } from './Activity';
import { LidarView } from '../components/LidarView';
import { RearView } from '../components/RearView';

export const FrontActivity = createActivity(function (props) {
    return (
        <Activity hidden={props.hidden} className="front">
            <RearView hidden={props.hidden} />
            <LidarView />
        </Activity>
    );
});
