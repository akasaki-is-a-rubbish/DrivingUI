import React from 'react';
import { Activity, createActivity } from './Activity';
import { LidarView } from '../components/LidarView';
import { RearView } from '../components/RearView';
import pdpd from "../../res/pdpd.png";
import { showLogo } from '../config';

export const FrontActivity = createActivity(function (props) {
    return (
        <Activity hidden={props.hidden} className="front">
            <RearView hidden={props.hidden} />
            <LidarView />
            {!showLogo ? null :
                <img src={pdpd} alt="" style={{
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                    width: '240px',
                    background: 'none',
                    height: 'auto',
                    'filter': 'drop-shadow(0 0 3px #000000)'
                }} />
            }
        </Activity>
    );
});
