import React from 'react';
import { Activity, createActivity } from './Activity';

export const SettingsActivity = createActivity(function (props) {
    return (
        <Activity hidden={props.hidden} className={"music"}>
            
        </Activity>
    );
});

