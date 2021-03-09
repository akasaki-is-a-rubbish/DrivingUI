import React, { useEffect, useRef } from 'react';
import car from './car.png';
import { Client } from './Client';
import { baseDistance, sensorFunction, sensorMap } from './config';

const PI = Math.PI;

export function CarView() {
  var ref = useRef<HTMLCanvasElement>(null);

  function redraw() {
    var canvas = ref.current;
    if (!canvas)
      throw new Error('no canvas!');
    var ctx = canvas.getContext('2d');
    if (!ctx)
      throw new Error('no context!');

    const M = 60; // margin
    const H = 170;
    const W = 200;
    const R = W / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(M - getOffset(0), M + H + R);

    for (let y = M + H + R; y > M + R; y -= 3) {
      let o = getOffset((M + H + R - y) / H * 100);
      ctx.lineTo(M - o, y);
    }

    for (let dire = PI; dire <= 2 * PI; dire += 3 / R) {
      let o = getOffset(100 + (dire - PI) / PI * 150);
      ctx.lineTo(...fromPolar(M + R, M + R, R + o, dire));
    }

    for (let y = M + R; y < M + H + R; y += 3) {
      let o = getOffset(250 + (y - (M + R)) / H * 100);
      ctx.lineTo(M + W + o, y);
    }

    for (let dire = 0; dire <= PI; dire += 3 / R) {
      let o = getOffset(350 + (dire / PI) * 150);
      ctx.lineTo(...fromPolar(M + R, M + H + R, R + o, dire));
    }

    ctx.closePath();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function fromPolar(x: number, y: number, len: number, rad: number): [x: number, y: number] {
    return [
      x + len * Math.cos(rad),
      y + len * Math.sin(rad)
    ];
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

  useEffect(() => {
    return Client.current.listenData((data) => {
      var d = Object.fromEntries(
        Object.keys(data)
          .flatMap(x =>
            Object.keys(data[x])
              .map(y => [x + y, data[x][y]])
          )
      );
      console.info(d);
      dataPoints = Object.entries(d).map(([x, val]) => 
        ({
          spread: sensorMap[x].spread,
          pos: sensorMap[x].pos,
          val: sensorFunction(val)
        })
      );
      redraw();
    });
  });

  // useEffect(() => {
  //   redraw();
  //   var timer = setInterval(() => {
  //     if ((data[0].pos += 1) >= 500)
  //       data[0].pos = 0;
  //     redraw();
  //   }, 16);
  //   return () => clearInterval(timer);
  // });

  return (
    <div className='car-view'>
      <canvas ref={ref} width='320' height='490' />
      <img className="car-body" src={car} alt="" />
    </div>
  );
}
