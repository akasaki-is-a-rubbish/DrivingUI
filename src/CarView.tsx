import React, { useEffect, useRef } from 'react';
import car from './car.png';
import { Client } from './Client';
import { sensorFunction } from './config';

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

    const H = 170;
    const W = 200;
    const R = W / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(50 - getOffset(0), 50 + H + R);

    for (let y = 50 + H + R; y > 50 + R; y -= 3) {
      let o = getOffset((50 + H + R - y) / H * 100);
      ctx.lineTo(50 - o, y);
    }

    for (let dire = PI; dire <= 2 * PI; dire += 3 / R) {
      let o = getOffset(100 + (dire - PI) / PI * 150);
      ctx.lineTo(...fromPolar(50 + R, 50 + R, R + o, dire));
    }

    for (let y = 50 + R; y < 50 + H + R; y += 3) {
      let o = getOffset(250 + (y - (50 + R)) / H * 100);
      ctx.lineTo(50 + W + o, y);
    }

    for (let dire = 0; dire <= PI; dire += 3 / R) {
      let o = getOffset(350 + (dire / PI) * 150);
      ctx.lineTo(...fromPolar(50 + R, 50 + H + R, R + o, dire));
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
    const SPREAD = 30;
    var result = 0;
    for (const it of dataPoints) {
      if (posDist(it.pos, pos) < SPREAD) {
        // console.info([it.pos, pos, it.val]);
        result += (Math.sin((1 - posDist(it.pos, pos) / SPREAD) * PI - PI / 2) + 1) / 2 * it.val;
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
      <canvas ref={ref} width='300' height='470' />
      <img className="car-body" src={car} alt="" />
    </div>
  );
}
