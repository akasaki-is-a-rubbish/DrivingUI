import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Activity } from './Basics';
import { Client } from './Client';
import { lidarName } from './config';
import { useWebfxCallback, useWebfxRef, fromPolar } from './utils';

export function LidarActivity(props: { hidden: boolean; }) {
  const data = useWebfxRef(Client.current.data);
  const canvas = useRef<HTMLCanvasElement>(null);

  const render = useMemo(() => {
    let ctx: CanvasRenderingContext2D;

    function drawPoint(ratio: number, dist: number) {
      var p = fromPolar(300, 300, dist / 10, ratio / 180 * Math.PI);
      ctx.beginPath();
      ctx.moveTo(...p);
      ctx.lineTo(...p);
      ctx.stroke();
    }

    return (data: any) => {
      ctx = canvas.current!.getContext('2d')!;
      ctx.lineCap = 'round';
      ctx.lineWidth = 5;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // ctx.beginPath();
      // ctx.moveTo(0, 0);
      // ctx.lineTo(100, 100);
      // ctx.stroke();
      const lidar = data[lidarName];
      if (lidar) {
        for (const p of lidar) {
          const [idk, rat, dist] = p;
          drawPoint(rat, dist);
        }
      }
    };
  }, []);

  useEffect(() => {
    render(data);
  }, [data]);

  return (
    <Activity hidden={props.hidden}>
      <div>{JSON.stringify(data[lidarName])}</div>
      <canvas width="600" height="600" ref={canvas}></canvas>
    </Activity>
  );
}
