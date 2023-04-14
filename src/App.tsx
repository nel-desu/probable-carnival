import { useState, useEffect, useRef } from 'react'
import { fabric } from 'fabric';
import { Canvas, Object } from 'fabric/fabric-impl';
import png from './assets/triangle.png';
import './App.css'

function App() {

  // 和图片三角形的高保持一致
  const SCALE = 100;

  // 图形填充的颜色（Path 下使用）
  const FILL_COLOR = 'rgb(215, 200, 200)'
  // 图形边框颜色
  const BORDER_COLOR = 'rgba(215, 200, 200, 0.8)'

  const canvasEl = useRef<HTMLCanvasElement>(null);

  const [canvasWidth, setCanvasWidth] = useState(document.documentElement.clientWidth);
  const [canvasHeight, setCanvasHeight] = useState(document.documentElement.clientHeight);

  useEffect(() => {
    const imgElement = document.getElementById('my-image') as HTMLImageElement;
    const canvas = new fabric.Canvas(canvasEl.current);

    imgElement.onload = () => {
      const triangles: Object[][] = [];
      const horizonCount = Number((canvasWidth / SCALE).toFixed(0)) + 5;
      const verticalCount = Number((canvasHeight / SCALE).toFixed(0)) + 5;
      console.log(`horizonCount: ${horizonCount}, verticalCount: ${verticalCount}`);

      for (let i = 0; i < verticalCount; i++) {
        const verticalTriangles: Object[] = [];
        for (let j = 0; j < horizonCount; j++) {
          let triangle;
          if (j % 2 == 0) {
            // 正三角
            triangle = genTriangle();
            triangle.set({
              top: i * SCALE,
              left: -(SCALE + i % 2 * SCALE) + j * SCALE
            });
          } else {
            // 垂直翻转的三角
            triangle = genInvertedTriangle();
            triangle.set({
              top: i * SCALE,
              left: -(SCALE + i % 2 * SCALE) + j * SCALE
            });
          }
          canvas.add(triangle);
          verticalTriangles.push(triangle);
        }
        triangles.push(verticalTriangles);
      }

      setTimeout(() => {
        trianglesFadeOut(canvas, triangles.flat(), true);
      }, 1000);

      canvas.renderAll();
    }

    window.addEventListener('resize', (e) => {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
    });

    return () => { canvas.dispose(); }
  }, []);

  function showAllTriangles(canvas: Canvas, triangles: Object[], show: boolean) {
    triangles.forEach(e => {
      e.set({ opacity: show ? 1 : 0, })
    });
    canvas.renderAll();
  }

  function trianglesFadeOut(canvas: Canvas, triangles: Object[], show: boolean) {
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        const triangle = removeRandomElement(triangles);
        if (triangle != null) {
          triangle.set({ opacity: show ? 1 : 0 });
          // canvas.remove(triangle);
        }
      }
      canvas.renderAll();
      trianglesFadeOut(canvas, triangles, show);
    }, 40);
  }

  function removeRandomElement<T>(arr: T[]): T | null {
    if (arr.length <= 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr.splice(randomIndex, 1)[0];
  }

  function genTriangle(): Object {
    const img = document.getElementById('my-image');
    if (!!img) {
      return new fabric.Image(document.getElementById('my-image') as HTMLImageElement, {
        width: SCALE * 2, height: SCALE,
        fill: FILL_COLOR,
        strokeWidth: 0,
        stroke: BORDER_COLOR,
        opacity: 0,
      });
    } else {
      return new fabric.Path(`M 0 0 L -${SCALE} ${SCALE} L ${SCALE} ${SCALE} z`, {
        fill: FILL_COLOR,
        strokeWidth: 0.5,
        stroke: BORDER_COLOR,
      });
    }
  }

  function genInvertedTriangle(): Object {
    const img = document.getElementById('my-image');
    if (!!img) {
      return new fabric.Image(img as HTMLImageElement, {
        width: SCALE * 2, height: SCALE,
        fill: FILL_COLOR,
        strokeWidth: 0,
        stroke: BORDER_COLOR,
        opacity: 0,
        flipY: true,
      });
    } else {
      return new fabric.Path(`M ${SCALE} 0 L 0 ${SCALE} L -${SCALE} 0 z`, {
        fill: FILL_COLOR,
        strokeWidth: 0.5,
        stroke: BORDER_COLOR,
      });
    }
  }

  return (
    <div className="App">
      <img id='my-image' style={{ display: 'none' }} src={png} width={SCALE} />
      <canvas id='canvas'
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasEl}>
      </canvas>

    </div>
  )
}

export default App
