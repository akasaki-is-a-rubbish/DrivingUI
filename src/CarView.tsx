import React, { useEffect, useRef } from 'react';
import car from './car.png';
import { Client } from './Client';
import { baseDistance, colors, sensorFunction, sensorMap, Color } from './config';
import { fromPolar, mixColor, useWebfxCallback, useWebfxRef } from './utils';

const PI = Math.PI;

export function CarView() {
  var ref = useRef<HTMLCanvasElement>(null);
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
    var prev = colors[0];
    var next = colors[1];
    for (let i = 1; i < colors.length; i++) {
      if (next.distance > o) break;
      [prev, next] = [next, colors[i]];
    }
    var color = mixColor(prev, next, (prev.distance - o) / (next.distance - prev.distance));
    // var color = next;
    ctx.strokeStyle = `rgb(${(color.r)}, ${(color.g)}, ${(color.b)})`;
    ctx.stroke();
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

    clear();

    ctx.strokeStyle = 'white';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;

    moveTo(M - getOffset(0), M + H + R);

    for (let y = M + H + R; y > M + R; y -= 3) {
      let o = getOffset((M + H + R - y) / H * 100);
      lineTo(M - o, y, o);
    }

    for (let dire = PI; dire <= 2 * PI; dire += 3 / R) {
      let o = getOffset(100 + (dire - PI) / PI * 150);
      lineTo(...fromPolar(M + R, M + R, R + o, dire), o);
    }


    for (let y = M + R; y < M + H + R; y += 3) {
      let o = getOffset(250 + (y - (M + R)) / H * 100);
      lineTo(M + W + o, y, o);
    }

    for (let dire = 0; dire <= PI; dire += 3 / R) {
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

  const data = useWebfxRef(Client.current.data);

  useWebfxCallback(Client.current.data.onChanged, (ref) => {
  });

  useEffect(() => {
    var d = Object.fromEntries(
      Object.keys(data)
        .flatMap(x =>
          Object.keys(data[x])
            .map(y => [x + y, data[x][y]])
        )
    );
    console.info(d);
    dataPoints = Object.entries(d)
      .map(([x, val]) => [sensorMap[x], val] as const)
      .filter(([sensor, val]) => sensor)
      .map(([sensor, val]) => {
        return {
          spread: sensor.spread,
          pos: sensor.pos,
          val: sensorFunction(val)
        };
      });
    redraw();
  }, [data]);

  return (
    <div className='car-view'>
      <canvas ref={ref} width='320' height='490' />
      <img className="car-body" src={car} alt="" />
    </div>
  );
}
