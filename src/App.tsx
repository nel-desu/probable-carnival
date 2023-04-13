import { useState, useEffect, useRef } from 'react'
import './App.css'
import { fabric } from 'fabric';
import { Path } from 'fabric/fabric-impl';

function App() {

  const canvasEl = useRef<HTMLCanvasElement>(null);

  const [canvasWidth, setCanvasWidth] = useState(document.documentElement.clientWidth);
  const [canvasHeight, setCanvasHeight] = useState(document.documentElement.clientHeight);

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
    });

    var canvas = new fabric.Canvas(canvasEl.current);


    const path1 = genTriangle();
    const path2 = genInvertedTriangle();

    path1.set({ left: 100, top: 100 });
    path2.set({ left: 120, top: 100 });
    canvas.add(path1);
    canvas.add(path2);

    canvas.renderAll();

    return () => {
      canvas.dispose();
    }
  }, []);

  const SCALE = 20;

  function genTriangle(): Path {
    return new fabric.Path(`M 0 0 L -${SCALE} ${SCALE} L ${SCALE} ${SCALE} z`, {
      fill: 'rgb(215, 200, 200)',
      strokeWidth: 0.5,
      stroke: 'rgba(215, 200, 200, 0.8)'
    });
  }

  function genInvertedTriangle(): Path {
    return new fabric.Path(`M ${SCALE} 0 L 0 ${SCALE} L -${SCALE} 0 z`, {
      fill: 'rgb(215, 200, 200)',
      strokeWidth: 0.5,
      stroke: 'rgba(215, 200, 200, 0.8)'
    });
  }

  return (
    <div className="App">
      <canvas id='canvas'
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasEl}>
      </canvas>
    </div>
  )
}

export default App
