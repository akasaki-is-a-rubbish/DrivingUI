import React, { Ref, useEffect, useRef, useState } from 'react'
import car from './car.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLImageElement | null>(null);

  return (
    <div className="App">
      <CarView />
    </div>
  )
}

function CarView() {
  var ref = useRef<HTMLCanvasElement>(null);

  function redraw() {
    var canvas = ref.current;
    if (!canvas) throw new Error('no canvas!');
    var ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no context!');

    var H = 170;
    var W = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(50, 50 + H + W / 2);

    for (let y = 50 + H + W / 2; y > 50 + W / 2; y -= 5) {
      ctx.lineTo(50, y);
    }

    for (let dire = 180; dire <= 360; dire += 10) {
      ctx.lineTo(...fromPolar(50 + W / 2, 50 + W / 2, W / 2, dire));
    }

    for (let y = 50 + W / 2; y < 50 + H + W / 2; y += 5) {
      ctx.lineTo(50 + W, y);
    }

    for (let dire = 0; dire <= 180; dire += 10) {
      ctx.lineTo(...fromPolar(50 + W / 2, 50 + H + W / 2, W / 2, dire));
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function fromPolar(x: number, y: number, len: number, dire: number): [x: number, y: number] {
    var rad = dire / 180 * Math.PI;
    return [
      x + len * Math.cos(rad),
      y + len * Math.sin(rad)
    ];
  }

  useEffect(() => {
    redraw();
  });

  return (
    <div className='car-view'>
      <canvas ref={ref} width='300' height='470' />
      <img className="car-body" src={car} alt="" />
    </div>
  );
}

export default App
