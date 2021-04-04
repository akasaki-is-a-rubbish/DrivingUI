import React from "react";
import { Activity } from "./Activity";

export function HomeActivity(props: { hidden: boolean; }) {
    return <Activity className="home" hidden={props.hidden}>
        
    </Activity>;
}