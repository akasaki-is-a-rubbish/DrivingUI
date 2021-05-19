import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, createActivity } from './Activity';
import { Client } from '../Client';
import { frontStats } from '../config';
import { delay, useWebfxCallback, useWebfxRef } from '../utils';
import { LidarView } from '../LidarView';
import arrow_down from '../../res/arrow_down.svg';

const imgArrowDown = loadImage(arrow_down);

const QUEUE_SIZE = 7;

export const FrontActivity = createActivity(function (props) {

    return (
        <Activity hidden={props.hidden} className="front">
            <RearView hidden={props.hidden} />
            <LidarView />
        </Activity>
    );
});

const RearView = React.memo(function ({ hidden }: { hidden: boolean }) {
    const canvas = useRef<HTMLCanvasElement>(null);

    const [{ w = 960, h = 540 }, setSize] = useState({} as any);
    const connectState = useWebfxRef(Client.current.connectionState);
    useWebfxCallback(Client.current.getData('image').onChanged, (x) => {
        if (x.value.w != w || x.value.h != h) {
            setSize(x.value);
        }
    }, [w, h]);

    const renderer = useMemo(() => {
        return createRearRenderer(canvas.current!, w, h);
    }, [canvas.current, w, h]);

    useWebfxCallback(Client.current.onReceivedBinary, async (data) => {
        if (renderer) await renderer.handle(data as ArrayBuffer);
        if (hidden || !renderer) {
            await delay(100);
        }
        Client.current.sendJson({ cmd: 'requestImage' });
    }, [renderer, hidden]);

    useWebfxCallback(Client.current.onOpen, () => {
        Client.current.sendJson({ cmd: 'requestImage' });
    }, []);

    useWebfxCallback(Client.current.getData('targets').onChanged, () => {
        renderer?.targetsCtr.incr();
    }, [renderer]);

    useWebfxCallback(Client.current.getData('lanePoints').onChanged, () => {
        renderer?.laneCtr.incr();
    }, [renderer]);

    console.info('rear render()');
    return <canvas className="frontView" width={w} height={h} ref={canvas}></canvas>;
});

function createRearRenderer(canvas: HTMLCanvasElement, w: number, h: number) {
    if (!canvas) return null;
    const ctx = canvas!.getContext('2d')!;
    const img = ctx.createImageData(w, h);
    const imgdata = img.data;
    imgdata.fill(255);

    const imgQueue: ArrayBuffer[] = [];

    const renderedCtr = new PerfCounter();
    let dropped = 0;
    const rafTime = new PerfTimer('raf');
    const convTime = new PerfTimer('conv');
    const canvasTime = new PerfTimer('draw');
    const laneCtr = new PerfCounter();
    const targetsCtr = new PerfCounter();

    function updateCounter() {
        renderedCtr.incr();
        [renderedCtr, laneCtr, targetsCtr].forEach(x => x.update());
        if (frontStats) {
            const fpss = [renderedCtr, laneCtr, targetsCtr].map(x => x.freq.toFixed(1)).join(', ');
            const rendertimes = [rafTime, convTime, canvasTime].join(' ');
            const text = `${w}x${h} | fps = ${fpss} | rendered = ${renderedCtr.total} | ${rendertimes} ms`;
            ctx.font = '18px Consolas,monospace';
            const textWidth = ctx.measureText(text);
            const left = 400;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(left, h - 24, textWidth.width + 15, 24);
            ctx.fillStyle = 'white';
            ctx.fillText(text, left + 10, h - (18 / 2));
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
        // console.info(targets);
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        const alpha = Math.max(1 - (Date.now() - targetsCtr.lastIncr) / 1000, 0.2);
        ctx.strokeStyle = `rgba(255,255,0,${alpha})`;
        ctx.font = '20px';
        ctx.fillStyle = `rgba(128,255,0,0.8)`;
        for (const t of targets) {
            let [x1, y1, x2, y2, conf, cataId, catagory] = t;
            if (conf < 0.2) continue;
            const xscale = 1, yscale = 1, yoffset = 0;
            x1 *= xscale; y1 *= yscale; x2 *= xscale; y2 *= yscale;
            y1 += yoffset; y2 += yoffset;
            const confAlpha = 0.4 + ((conf - 0.2) / 0.8) * 0.6;
            ctx.strokeStyle = `rgba(255,255,0,${alpha * confAlpha})`;
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            const xc = (x2 + x1) / 2;
            if (['car', 'person', 'bus', 'truck'].includes(catagory)
                && (x2 - x1 >= w * 0.1 || y2 - y1 >= h * 0.1)
                && (w * 0.3 < x2 && x1 < w * 0.7)) {
                const arrowy = y1 - 70 + Math.sin(Math.abs((Date.now() % 1000) - 500) / 500) * (20);
                ctx.drawImage(imgArrowDown, (x1 + x2) / 2 - 64 / 2, arrowy, 64, 64);
            }
            ctx.fillStyle = `rgba(128,255,0,${confAlpha})`;
            const text = catagory + ' ' + (conf * 100).toFixed();
            const textWidth = ctx.measureText(text).width;
            ctx.fillText(text, (x1 + x2) / 2 - textWidth / 2, y1 - 10);
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

    // setTimeout(() => {
    //     ctx.drawImage(imgArrowDown, 0, 0, 64, 64);
    // }, 300);

    const recvTime = new PerfTimer('recv');
    recvTime.begin();

    let pendingImage: ArrayBuffer | null = null;
    async function handle(data: ArrayBuffer) {
        const requestedAF = !!pendingImage;
        pendingImage = data;
        if (!requestedAF) {
            recvTime.end();
            rafTime.begin();
            await new Promise(r => requestAnimationFrame(r));
            rafTime.end();

            const delayTask = delay(30);

            if (imgQueue.length == QUEUE_SIZE) {
                const renderBuf = imgQueue.shift()!;
                render(renderBuf);
                new Uint8Array(renderBuf).set(new Uint8Array(pendingImage));
                imgQueue.push(renderBuf);
            } else {
                imgQueue.push(pendingImage)
            }
            recvTime.begin();

            await delayTask;

            pendingImage = null;
        } else {
            dropped++;
        }
    }
    return { handle, laneCtr, targetsCtr };
}

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

class PerfCounter {
    total = 0;
    freq = 0;
    lastTotal = 0;
    lastUpdate = Date.now();
    lastIncr = 0;

    incr() {
        this.total++;
        this.lastIncr = Date.now();
    }
    update() {
        const now = Date.now();
        if (now - this.lastUpdate >= 1000) {
            this.freq = (this.total - this.lastTotal) * 1000 / (now - this.lastUpdate);
            this.lastTotal = this.total;
            this.lastUpdate = now;
        }
        return this;
    }
}

function loadImage(path: string) {
    var img = document.createElement('img');
    img.src = path;
    return img;
}
