import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity } from './Activity';
import { Client } from '../Client';
import { frontStats } from '../config';
import { delay, useWebfxCallback, useWebfxRef } from '../utils';
import { LidarView } from '../LidarView';

export const FrontActivity = React.memo(function (props: { hidden: boolean; }) {
    const canvas = useRef<HTMLCanvasElement>(null);

    const [{ w = 1, h = 1 }, setSize] = useState({} as any);
    useWebfxCallback(Client.current.getData('image').onChanged, (x) => {
        if (x.value.w != w || x.value.h != h) {
            setSize(x.value);
        }
    }, [w, h]);

    const imageHandler = useMemo(() => {
        if (!canvas.current) return null;
        const ctx = canvas.current!.getContext('2d')!;
        const img = ctx.createImageData(w, h);
        const imgdata = img.data;
        imgdata.fill(255);

        let lastReport = Date.now();
        let rendered = 0;
        let dropped = 0;
        let fps = 0;
        let fpsReport = 0;
        let rafTime = new PerfTimer('raf');
        let convTime = new PerfTimer('conv');
        let canvasTime = new PerfTimer('draw');
        function updateCounter() {
            fps++; rendered++;
            const now = Date.now();
            if (now - lastReport >= 1000) {
                lastReport = now;
                fpsReport = fps;
                fps = 0;
            }
            if (frontStats) {
                const text = `${w}x${h} | fps = ${fpsReport} | rendered = ${rendered} | dropped = ${dropped} | ${[rafTime, convTime, canvasTime].join(', ')} ms`;
                ctx.font = '18px Consolas,monospace';
                const textWidth = ctx.measureText(text);
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(400, h - 30, textWidth.width + 15, 24);
                ctx.fillStyle = 'white';
                ctx.fillText(text, 410, h - 10);
            }
        }

        function convertData(data: ArrayBuffer) {
            convTime.begin();
            const buf = new Uint8Array(data);
            const rgba = imgdata;
            const pixelCount = buf.length / 3;
            for (var i = 0; i < pixelCount; i++) {
                rgba[4 * i] = buf[3 * i];
                rgba[4 * i + 1] = buf[3 * i + 1];
                rgba[4 * i + 2] = buf[3 * i + 2];
                // rgba[4 * i + 3] = 255;
            }
            convTime.end();
        }

        function drawPoints() {
            const points = [...(Client.current.data.value['frontPoints'] || [])];
            // console.info(points);
            if (points instanceof Array) {
                ctx.lineCap = 'round';
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'red';
                for (const { x, y } of points) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }

        function render(data: ArrayBuffer) {
            convertData(data);

            canvasTime.begin();
            ctx.putImageData(img, 0, 0);
            drawPoints();
            canvasTime.end();
            updateCounter();
        }

        let pendingImage: ArrayBuffer | null = null;
        async function handle(data: ArrayBuffer) {
            const requestedAF = !!pendingImage;
            pendingImage = data;
            if (!requestedAF) {
                rafTime.begin();
                await new Promise(r => requestAnimationFrame(r));
                rafTime.end();
                render(pendingImage!);
                pendingImage = null;
            } else {
                dropped++;
            }
        }
        return handle;
    }, [w, h, canvas.current]);

    useWebfxCallback(Client.current.onReceivedBinary, async (data) => {
        if (imageHandler) await imageHandler(data as ArrayBuffer);
        if (props.hidden || !imageHandler) {
            await delay(100);
        }
        Client.current.sendJson({ cmd: 'requestImage' });
    }, [imageHandler, props.hidden]);

    useWebfxCallback(Client.current.onOpen, () => {
        Client.current.sendJson({ cmd: 'requestImage' });
    }, []);

    console.info('front render()');

    return (
        <Activity hidden={props.hidden} className="front">
            <canvas className="frontView" width={w} height={h} ref={canvas}></canvas>
            <LidarView />
        </Activity>
    );
});

class PerfTimer {
    value = 0;
    start = 0;
    constructor(readonly name: string) {
    }

    begin() {
        this.start = Date.now();
    }
    end() {
        this.value = Date.now() - this.start;
    }

    toString() {
        return this.name + '=' + this.value;
    }
}
