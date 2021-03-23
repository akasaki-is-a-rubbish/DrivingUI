import React, { useEffect, useRef } from 'react';
import { Activity } from './Basics';

export function FrontActivity(props: { hidden: boolean; }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (props.hidden) return;
        const ctx = canvas.current!.getContext('2d')!;
        const img = ctx.createImageData(1280, 720);
        const imgdata = img.data;
        let val = 0;
        let raf: number | null = null;

        function render() {
            for(let i = 0; i < imgdata.length; i++) {
                imgdata[i] = val;
            }
            val = (val + 1) % 256;
            ctx.putImageData(img, 0, 0);
            raf = requestAnimationFrame(render);
        }
        render();
        return () => (raf != null && cancelAnimationFrame(raf));
    }, [props.hidden]);
    return (
        <Activity hidden={props.hidden}>
            <canvas width='1280' height='720' ref={canvas}></canvas>
        </Activity>
    );
}
