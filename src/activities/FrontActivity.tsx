import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity } from './Activity';
import { Client } from '../Client';
import { frontStats } from '../config';
import { delay, useWebfxCallback, useWebfxRef } from '../utils';
import { LidarView } from '../LidarView';

export const FrontActivity = React.memo(function (props: { hidden: boolean; }) {
    const canvas = useRef<HTMLCanvasElement>(null);

    const [{ w = 960, h = 540 }, setSize] = useState({} as any);
    const connectState = useWebfxRef(Client.current.connectionState);
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
                const text = `${w}x${h} | fps = ${fpsReport} | rendered = ${rendered} | ${[rafTime, convTime, canvasTime].join(', ')} ms`;
                ctx.font = '18px Consolas,monospace';
                const textWidth = ctx.measureText(text);
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(400, h - 24, textWidth.width + 15, 24);
                ctx.fillStyle = 'white';
                ctx.fillText(text, 410, h - (18 / 2));
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
            const points = [...(Client.current.data.value['lanePoints'] || [])];
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

        function drawTargets() {
            const targets = (Client.current.data.value['targets'] as any[] || []) as
                [number, number, number, number, number, number, string][];
            console.info(targets);
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            const alpha = Math.max(1 - (Date.now() - targetsCtr.lastIncr) / 200, 0.3);
            ctx.strokeStyle = `rgba(255,255,0,${alpha})`;
            ctx.font = '20px';
            ctx.fillStyle = `rgba(128,255,0,0.8)`;
            for (const t of targets) {
                let [x1, y1, x2, y2, _, cataId, catagory] = t;
                console.info(x1, y1, x2, y2);
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
                ctx.fillText(catagory, x1, y1 - 10);
            }
        }

        function render(data: ArrayBuffer) {
            convertData(data);

            canvasTime.begin();
            ctx.putImageData(img, 0, 0);
            drawPoints();
            drawTargets();
            canvasTime.end();
            updateCounter();
        }

        function noSignal() {
            for (let p = 0; p < imgdata.length; p += 4) {
                imgdata[p] = imgdata[p + 1] = imgdata[p + 2] = Math.floor(128 + Math.random() * 128);
            }
            ctx.putImageData(img, 0, 0);
            ctx.font = '160px Consolas,monospace';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.fillText('NO SIGNAL', 80, 320);
            ctx.strokeText('NO SIGNAL', 80, 320);
        }
        // noSignal();

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
        return { handle };
    }, [w, h, canvas.current]);

    useWebfxCallback(Client.current.onReceivedBinary, async (data) => {
        if (imageHandler) await imageHandler.handle(data as ArrayBuffer);
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
