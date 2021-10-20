import React from 'react';
import { Activity, createActivity } from './Activity';
import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import { appTheme } from '../appTheme';
import { useWebfxRef } from '../utils';

export const SettingsActivity = createActivity(function (props) {
    return (
        <Activity hidden={props.hidden} className={"settings"}>
            <FormGroup>
                <FormControlLabel control={
                    <Switch value={useWebfxRef(appTheme.enabledRef)} onChange={(e, val) => {
                        appTheme.toggle(val);
                    }} />
                } label="夜间模式" />
            </FormGroup>
        </Activity>
    );
});
