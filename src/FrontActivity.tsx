import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Activity } from './Basics';
import { Client } from './Client';
import { useWebfxCallback, useWebfxRef } from './utils';

export function FrontActivity(props: { hidden: boolean; }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const {w=1, h=1} = useWebfxRef(Client.current.getData('image')) || {};
    const render = useMemo(() => {
        if (!canvas.current) return () => {};
        const ctx = canvas.current!.getContext('2d')!;
        const img = ctx.createImageData(w, h);
        const imgdata = img.data;

        function render(data: ArrayBuffer) {
            console.info('rendering image')
            const buf =  new Uint8Array(data);
            const pixelCount = buf.length / 3;
            for (var i = 0; i < pixelCount; i++) {
                imgdata[4 * i] = buf[3 * i + 2];
                imgdata[4 * i + 1] = buf[3 * i + 1];
                imgdata[4 * i + 2] = buf[3 * i + 0];
                imgdata[4 * i + 3] = 255;
            }
            ctx.putImageData(img, 0, 0);
            const points = [...Client.current.data.value['frontPoints']];
            console.info(points);
            if (points instanceof Array) {
                ctx.lineCap = 'round';
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'red';
                for (const {x, y} of points) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }
        return render;
    }, [w, h, canvas.current]);
    useWebfxCallback(Client.current.onReceivedBinary, (data) => {
        if (!props.hidden) {
            data.arrayBuffer().then(buf => render(buf));
        }
    }, [render, props.hidden]);
    return (
        <Activity hidden={props.hidden} className="front">
            <canvas width={w} height={h} ref={canvas}></canvas>
        </Activity>
    );
}
