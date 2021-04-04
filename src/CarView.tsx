import React, { useEffect, useMemo, useRef } from 'react';
import car from './car.png';
import { Client } from './Client';
import { baseDistance, colors, sensorFunction, sensorMap, RGB } from './config';
import { fromPolar, mixColor, noInteractive, useWebfxCallback, useWebfxRef } from './utils';

const PI = Math.PI;

const sensorDataNames = [...new Set(Object.keys(sensorMap).map(x => x.substr(0, x.indexOf('_'))))];

export const CarView = React.memo(function () {
  const ref = useRef<HTMLCanvasElement>(null);

  const painter = useMemo(() => {
    var canvas: HTMLCanvasElement;
    var ctx: CanvasRenderingContext2D;

    function clear() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    var lastX: number, lastY: number;
    function moveTo(x: number, y: number) {
      lastX = x; lastY = y;
    }

    /**
     * @param o offset
     */
    function lineTo(x: number, y: number, o: number) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      lastX = x; lastY = y;
      o -= baseDistance;
      const color = getColor(o);
      ctx.strokeStyle = `rgba(${(color.r)}, ${(color.g)}, ${(color.b)}, ${(color.a)})`;
      ctx.stroke();
    }

    function moveAround(pos: number, dist: number) {
      
    }

    function redraw() {
      canvas = ref.current!;
      if (!canvas)
        throw new Error('no canvas!');
      ctx = canvas.getContext('2d')!;
      if (!ctx)
        throw new Error('no context!');

      const M = 60; // margin
      const H = 170;
      const W = 200;
      const R = W / 2;
      const STEP = 1;

      clear();

      ctx.strokeStyle = 'white';
      ctx.lineCap = 'round';
      ctx.lineWidth = 5;

      moveTo(M - getOffset(0), M + H + R);

      for (let y = M + H + R; y > M + R; y -= STEP) {
        let o = getOffset((M + H + R - y) / H * 100);
        lineTo(M - o, y, o);
      }

      for (let dire = PI; dire <= 2 * PI; dire += STEP / R) {
        let o = getOffset(100 + (dire - PI) / PI * 150);
        lineTo(...fromPolar(M + R, M + R, R + o, dire), o);
      }


      for (let y = M + R; y < M + H + R; y += STEP) {
        let o = getOffset(250 + (y - (M + R)) / H * 100);
        lineTo(M + W + o, y, o);
      }

      for (let dire = 0; dire <= PI; dire += STEP / R) {
        let o = getOffset(350 + (dire / PI) * 150);
        lineTo(...fromPolar(M + R, M + H + R, R + o, dire), o);
      }

      lineTo(M - getOffset(0), M + H + R, getOffset(0));
    }

    let dataPoints: { pos: number; val: number; spread: number; }[] = [];

    function posDist(a: number, b: number) {
      return Math.min(a > b ? a - b : b - a, a > b ? (500 - a + b) : (500 - b + a));
    }

    function getOffset(pos: number) {
      var result = baseDistance;
      for (const it of dataPoints) {
        if (posDist(it.pos, pos) < it.spread) {
          // console.info([it.pos, pos, it.val]);
          result += (Math.sin((1 - posDist(it.pos, pos) / it.spread) * PI - PI / 2) + 1) / 2 * it.val;
        }
      }
      return result;
    }

    function getColor(o: number) {
      var prev = colors[0];
      var next = colors[1];
      for (let i = 2; i < colors.length; i++) {
        if (next.distance < o) break;
        [prev, next] = [next, colors[i]];
      }
      return mixColor(prev, next, 1 - (o - prev.distance) / (next.distance - prev.distance));
    }

    return {
      get dataPoints() { return dataPoints; },
      set dataPoints(val) { dataPoints = val; },
      redraw
    };
  }, []);

  const data = sensorDataNames.map(x => [x, useWebfxRef(Client.current.getData(x)) || {}]);
  console.info(data);
  const data2 = data
    .filter(([x, val]) => !(val instanceof Array))
    .flatMap(([x, val]) =>
      Object.entries(val as Record<string, number>)
        .map(([xx, yy]) => [x + '_' + xx, yy] as const)
    )
    .map(([x, val]) => [sensorMap[x], val] as const)
    .filter(([sensor, val]) => sensor) as [typeof sensorMap[string], number][];


  useEffect(() => {
    painter.dataPoints = data2.map(([sensor, val]) => {
        return {
          spread: sensor.spread,
          pos: sensor.pos,
          val: sensorFunction(val)
        };
      });
    painter.redraw();
    console.info('rerender radar');
  }, [data]);

  console.info('CarView render()');

  return (
    <div className='car-view' {...noInteractive()}>
      <canvas ref={ref} width='320' height='490' />
      <img className="car-body" src={car} alt="" />
    </div>
  );
});
