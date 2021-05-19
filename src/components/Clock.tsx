import React, { useState } from "react";
import { useEffect } from "react"
import { useAutoUpdatingState } from "../utils";

export function ClockText() {
    const text = useAutoUpdatingState(() => getClockText());
    return <span>{text}</span>
}

function getClockText() {
    var d = new Date();
    return `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}`;
}

function pad(str: string | number, len: number) {
    if (typeof str == 'number') str = str.toString();
    while(str.length < len) str = '0' + str;
    return str;
}
