import { Timer } from '@yuuza/webfx';
import React, { useEffect, useMemo, useRef } from 'react';
import car from '../car.png';
import carbg from '../../res/carbg.svg';
import { Client } from '../Client';
import { baseDistance, colors, sensorFunction, sensorMap, RGB } from '../config';
import { fromPolar, getColor, mixColor, noInteractive, useWebfxCallback, useWebfxRef } from '../utils';

const PI = Math.PI;

const sensorDataNames = [...new Set(Object.keys(sensorMap).map(x => x.substr(0, x.indexOf('_'))))];

export const TopDownView = React.memo(function (props: { hidden: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const beep = useMemo(() => new Beeper(), []);

  useEffect(() => () => beep.setInterval(-1), []);

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
      const color = getColor(colors, o);
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


      ctx.strokeStyle = 'white';
      ctx.lineCap = 'round';
      ctx.lineWidth = 10;

      ctx.beginPath();
      ctx.resetTransform();
      clear();

      // moveTo(5, 530);
      // const meterWidth = 300;
      // for (let y = 0; y < 200; y++) {
      //   lineTo(5 + (y / 200 * meterWidth), 5, y / 200 * 80 - 30)
      // }

      ctx.translate(20, 20);
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

    return {
      get dataPoints() { return dataPoints; },
      set dataPoints(val) { dataPoints = val; },
      redraw
    };
  }, []);

  const data = sensorDataNames.map(x => [x, useWebfxRef(Client.current.getData(x)) || {}]);
  // console.info(data);
  const data2 = data
    .filter(([x, val]) => !(val instanceof Array))
    .flatMap(([x, val]) =>
      Object.entries(val as Record<string, number>)
        .map(([xx, yy]) => [x + '_' + xx, yy] as const)
    )
    .map(([x, val]) => [sensorMap[x], val] as const)
    .filter(([sensor, val]) => sensor) as [typeof sensorMap[string], number][];

  useEffect(() => {
    if (!props.hidden) {
      console.info('radar data2', data2);
      painter.dataPoints = data2.map(([sensor, val]) => {
        return {
          spread: sensor.spread,
          pos: sensor.pos,
          val: sensorFunction(val)
        };
      });
      painter.redraw();
      console.info('rerender radar');

      const min = data2.map(x => x[1])
        .filter(x => x != 0)
        .reduce((p, c) => Math.min(p, c), 10000);
      if (min < 100) beep.setInterval(0);
      else if (min < 300) beep.setInterval(100);
      else if (min < 600) beep.setInterval(300);
      else if (min < 900) beep.setInterval(500);
      else beep.setInterval(-1);
    } else {
      beep.setInterval(-1);
    }
  }, [data, props.hidden]);

  console.info('CarView render()');

  return (
    <div className='car-view' {...noInteractive()}>
      <img style={{
        left: -17 + 60 + 'px',
        top: 32 + 20 + 'px'
      }} className="car-bg" src={carbg} alt="" />
      <canvas ref={ref} width='370' height='550'
        className='car-line'
      // style={{background: 'gray'}}
      />
      <img style={{
        left: 30 + 20 + 'px',
        top: 185 + 20 + 'px'
      }} className="car-body" src={car} alt="" />
    </div>
  );
});


class Beeper {
  ctx = new AudioContext();
  interval = 0;
  lastBeep: OscillatorNode | null = null;
  freq = 1174;
  running = new Timer(() => {
    this.lastBeep?.stop();
    const beep = this.ctx.createOscillator();
    this.lastBeep = beep;
    beep.connect(this.ctx.destination);
    beep.detune.value = this.freq;
    beep.start(this.ctx.currentTime + this.ctx.baseLatency);
    beep.stop(this.ctx.currentTime + this.ctx.baseLatency + 0.05);
  });

  setInterval(i: number) {
    if (this.interval == i) return;
    console.info('interval', i);
    this.interval = i;
    this.running.tryCancel();
    if (i < 0) {
      this.lastBeep?.stop();
      this.lastBeep = null;
    } else if (i == 0) {
      const beep = this.ctx.createOscillator();
      this.lastBeep = beep;
      beep.connect(this.ctx.destination);
      beep.detune.value = this.freq;
      beep.start(this.ctx.currentTime);
    } else {
      this.running.interval(i);
    }
  }
}
