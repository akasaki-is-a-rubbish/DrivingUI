import { Ref } from '@yuuza/webfx';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Activity } from './Basics';
import { Client } from './Client';
import { lidarName } from './config';
import { useWebfxCallback, useWebfxRef, fromPolar, pointDist } from './utils';

export function LidarActivity(props: { hidden: boolean; }) {
  const windowed = useMemo(() => new DataWindow(Client.current.getData(lidarName), 100), []);
  useEffect(() => {
    windowed.start();
    return () => windowed.stop();
  }, []);
  const data = useWebfxRef(windowed.data);
  const canvas = useRef<HTMLCanvasElement>(null);

  const render = useMemo(() => {
    let ctx: CanvasRenderingContext2D;
    let lastP: {x: number, y: number} | null = null;

    function drawPoint(ratio: number, dist: number) {
      var [x, y] = fromPolar(300, 300, dist * 0.02, ratio / 180 * Math.PI);
      ctx.beginPath();
      if (lastP && pointDist(lastP.x, lastP.y, x, y) < 0) {
        ctx.moveTo(lastP.x, lastP.y);
      } else {
        ctx.moveTo(x, y);
      }
      ctx.lineTo(x, y);
      ctx.stroke();
      lastP = {x, y};
    }

    return (data: any) => {
      ctx = canvas.current!.getContext('2d')!;
      ctx.lineCap = 'round';
      ctx.lineWidth = 3;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // ctx.beginPath();
      // ctx.moveTo(0, 0);
      // ctx.lineTo(100, 100);
      // ctx.stroke();
      if (data) {
        for (const p of data) {
          const [idk, rat, dist] = p;
          drawPoint(rat, dist);
          // if (idk == 15) console.info(idk);
          // else console.info(idk, rat, dist);
        }
      }
    };
  }, []);

  useEffect(() => {
    render(data);
  }, [data]);

  return (
    <Activity hidden={props.hidden}>
      {/* <div>{JSON.stringify(data[lidarName])}</div> */}
      <canvas width="600" height="600" ref={canvas}></canvas>
    </Activity>
  );
}

class DataWindow<T> {
  data = new Ref<T[]>();
  constructor(readonly baseData: Ref<T[]>, readonly size: number) {
    this.data.value = [...(baseData.value || [])];
  }
  start() {
    this.baseData.onChanged.add(this._onChanged);
  }
  stop() {
    this.baseData.onChanged.remove(this._onChanged);
  }
  _onChanged = (ref: Ref<T[]>) => {
    console.info(ref.value?.length);
    var newdata = ref.value || [];
    var combined = [...this.data.value!, ...newdata];
    if (combined.length > this.size)
      combined = combined.slice(combined.length - this.size);
    this.data.value = combined;
  };
}
