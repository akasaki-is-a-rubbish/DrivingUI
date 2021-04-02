import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity } from './Basics';
import { Client } from './Client';
import { useWebfxCallback, useWebfxRef } from './utils';

export function FrontActivity(props: { hidden: boolean; }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const domInfo = useRef<HTMLDivElement>(null);
    const domImg = useRef<HTMLImageElement>(null);
    const { w = 1, h = 1 } = useWebfxRef(Client.current.getData('image')) || {};
    const imageHandler = useMemo(() => {
        if (!domImg.current) return () => { };
        // const ctx = canvas.current!.getContext('2d')!;
        // const img = ctx.createImageData(w, h);
        // const imgdata = img.data;
        // imgdata.fill(128);

        let lastReport = Date.now();
        let rendered = 0;
        let dropped = 0;
        let fps = 0;
        let fpsReport = 0;
        let rafTime = 0;
        let convTime = 0;
        let canvasTime = 0;
        function updateCounter() {
            fps++; rendered++;
            const now = Date.now();
            if (now - lastReport >= 1000) {
                lastReport = now;
                fpsReport = fps;
                fps = 0;
            }
            const text = `${w}x${h} | fps = ${fpsReport} | rendered = ${rendered} | dropped = ${dropped} | ${rafTime} + ${convTime} + ${canvasTime} ms`;
            domInfo.current!.textContent = text;
            // ctx.font = '20px Consolas';
            // const textWidth = ctx.measureText(text);
            // ctx.fillStyle = 'black';
            // ctx.fillRect(0, 0, textWidth.width, 22);
            // ctx.fillStyle = 'white';
            // ctx.fillText(text, 0, 20);
        }

        // function convertData(data: ArrayBuffer) {
        //     const convBegin = Date.now();
        //     const buf = new Uint8Array(data);
        //     const pixelCount = buf.length / 3;
        //     for (var i = 0; i < pixelCount; i++) {
        //         imgdata[4 * i] = buf[3 * i + 2];
        //         imgdata[4 * i + 1] = buf[3 * i + 1];
        //         imgdata[4 * i + 2] = buf[3 * i + 0];
        //         imgdata[4 * i + 3] = 255;
        //     }
        //     convTime = Date.now() - convBegin;
        // }

        async function render(data: Blob) {
            // ctx.clearRect(0, 0, w, h);
            // convertData(data);

            const beginLoad = Date.now();
            const imgele = await new Promise<HTMLImageElement>(resolve => {
                const ele = domImg.current!;
                // const ele = document.createElement('img');
                const objurl = URL.createObjectURL(data);
                ele.src = objurl;
                ele.onload = (e) => {
                    URL.revokeObjectURL(objurl);
                    resolve(ele);
                };
            });
            convTime = Date.now() - beginLoad;

            // const beginCanvas = Date.now();
            // ctx.drawImage(imgele, 0, 0);
            // // ctx.putImageData(img, 0, 0);
            // const points = [...(Client.current.data.value['frontPoints'] || [])];
            // // console.info(points);
            // if (points instanceof Array) {
            //     ctx.lineCap = 'round';
            //     ctx.lineWidth = 10;
            //     ctx.strokeStyle = 'red';
            //     for (const { x, y } of points) {
            //         ctx.beginPath();
            //         ctx.moveTo(x, y);
            //         ctx.lineTo(x, y);
            //         ctx.stroke();
            //     }
            // }
            // canvasTime = Date.now() - beginCanvas;
            updateCounter();
        }

        let pendingImage: Blob | null = null;
        function handle(data: Blob) {
            const requestedAF = !!pendingImage;
            pendingImage = data;
            if (!requestedAF) {
                const rafBegin = Date.now();
                requestAnimationFrame(
                    async () => {
                        rafTime = Date.now() - rafBegin;
                        await render(pendingImage!);
                        pendingImage = null;
                    }
                );
            } else {
                dropped++;
            }
        }
        return handle;
    }, [w, h, canvas.current]);

    useWebfxCallback(Client.current.onReceivedBinary, (data) => {
        if (!props.hidden) {
            imageHandler(data);
        }
    }, [imageHandler, props.hidden]);

    return (
        <Activity hidden={props.hidden} className="front">
            {/* <canvas width={w} height={h} ref={canvas}></canvas> */}
            <div ref={domInfo} style={{position: 'absolute', top: 0, background: 'black', color: 'white'}}>Info</div>
            <img ref={domImg} />
        </Activity>
    );
}
