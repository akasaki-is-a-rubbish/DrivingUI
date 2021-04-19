import React from 'react';
import { Activity } from './Activity';

export const SettingsActivity = React.memo(function (props: { hidden: boolean; }) {
    return (
        <Activity hidden={props.hidden} className={"music"}>
            
        </Activity>
    );
});

