import React, { useEffect, useRef } from 'react';
import { Activity } from './Basics';
import { Client } from './Client';
import { useWebfxCallback, useWebfxRef } from './utils';

export function FrontActivity(props: { hidden: boolean; }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const {w=0, h=0} = useWebfxRef(Client.current.getData('image')) || {};
    useWebfxCallback(Client.current.onReceivedBinary, async (data) => {
        if (props.hidden) return;
        console.info('rendering image')
        const ctx = canvas.current!.getContext('2d')!;
        const img = ctx.createImageData(w, h);
        const imgdata = img.data;
        const buf =  new Uint8Array(await data.arrayBuffer());
        const pixelCount = buf.length / 3;
        for (var i = 0; i < pixelCount; i++) {
            imgdata[4 * i] = buf[3 * i];
            imgdata[4 * i + 1] = buf[3 * i + 1];
            imgdata[4 * i + 2] = buf[3 * i + 2];
            imgdata[4 * i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
    }, [props.hidden, w, h]);
    return (
        <Activity hidden={props.hidden} className="front">
            <canvas width={w} height={h} ref={canvas}></canvas>
        </Activity>
    );
}
