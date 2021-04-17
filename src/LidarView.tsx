import { Ref } from '@yuuza/webfx';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Activity } from './activities/Activity';
import { Client } from './Client';
import { lidarName, lidarPointColors } from './config';
import { useWebfxCallback, useWebfxRef, fromPolar, pointDist, getColor } from './utils';

const CANVAS_SIZE = [250, 250];

export const LidarView = React.memo(function () {
  const windowed = useMemo(() => new DataWindow(Client.current.getData(lidarName), 200, 3), []);
  const data = useWebfxRef(windowed.data);
  const canvas = useRef<HTMLCanvasElement>(null);

  const render = useMemo(() => {
    let ctx: CanvasRenderingContext2D;
    let lastP: { x: number, y: number; } | null = null;

    function drawPoint(ratio: number, dist: number, quality: number) {
      var [x, y] = fromPolar(CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] / 2, dist * 0.015, ratio / 180 * Math.PI);
      ctx.beginPath();
      if (lastP && pointDist(lastP.x, lastP.y, x, y) < 0) {
        ctx.moveTo(lastP.x, lastP.y);
      } else {
        ctx.moveTo(x, y);
      }
      ctx.lineTo(x, y);
      const color = getColor(lidarPointColors, dist);
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${quality * color.a})`;
      ctx.stroke();
      lastP = { x, y };
    }

    return (data: any) => {
      ctx = canvas.current!.getContext('2d')!;
      ctx.lineCap = 'round';
      ctx.lineWidth = 3;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.moveTo(0, 0);
      ctx.lineTo(CANVAS_SIZE[0], 0);
      ctx.lineTo(CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] / 2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
      ctx.fill();
      // ctx.beginPath();
      // ctx.moveTo(0, 0);
      // ctx.lineTo(100, 100);
      // ctx.stroke();
      if (data) {
        for (const p of data) {
          const [quality, rat, dist] = p;
          drawPoint(rat, dist, quality / 15);
        }
      }
    };
  }, []);

  useEffect(() => {
    // console.info('Lidar rendering', data);
    render(data);
  }, [data]);

  return (
    <canvas className="lidarView" width={CANVAS_SIZE[0]} height={CANVAS_SIZE[1]} ref={canvas}></canvas>
  );
});

class DataWindow<T> {
  readonly data = new Ref<T[]>();
  private history: T[][] = [];
  constructor(
    readonly baseData: Ref<T[]>,
    readonly maxSize: number,
    readonly maxIter: number,
  ) {
    this.data.value = [...(baseData.value || [])];
    this.data.onChanged.onChanged.add((add) => {
      if (add && this.data.onChanged.length == 1) {
        this.baseData.onChanged.add(this._onChanged);
      } else if (this.data.onChanged.length == 0) {
        this.baseData.onChanged.remove(this._onChanged);
      }
    });
  }
  _onChanged = (ref: Ref<T[]>) => {
    // console.info(ref.value?.length);
    var newdata = ref.value || [];
    this.history.push(newdata);
    if (this.maxIter && this.history.length > this.maxIter)
      this.history.shift();
    var combined = this.history.flat();
    if (this.maxSize && combined.length > this.maxSize)
      combined = combined.slice(combined.length - this.maxSize);
    this.data.value = combined;
  };
}
