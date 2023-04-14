import { useState, useEffect, useRef } from 'react'
import { fabric } from 'fabric';
import { Canvas, Object } from 'fabric/fabric-impl';
import png from './assets/triangle.png';
import './App.css';

function App() {

  // 三角形的高
  const SCALE = 100;

  // 图形填充的颜色（Path 下使用）
  const FILL_COLOR = 'rgb(220, 210, 180)';
  // 图形边框颜色
  const BORDER_COLOR = 'rgba(220, 210, 180, 0.8)';
  // 线条颜色
  const LINE_COLOR = 'rgba(220, 210, 180, 0.8)';

  const canvasEl = useRef<HTMLCanvasElement>(null);

  const [canvasWidth, setCanvasWidth] = useState(document.documentElement.clientWidth);
  const [canvasHeight, setCanvasHeight] = useState(document.documentElement.clientHeight);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current);

    const showTriangles = () => {
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
        showLines(canvas, () => {
          // trianglesFadeIn(canvas, triangles.flat(), true);
        });
      }, 1);

      canvas.renderAll();
    };

    // 获取图片节点，如果没有获取到，就使用绘制的三角形
    const imgElement = document.getElementById('my-image');
    if (imgElement != null) {
      imgElement.onload = () => {
        showTriangles();
      }
    } else {
      showTriangles();
    }

    window.addEventListener('resize', (e) => {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
    });

    return () => { canvas.dispose(); }
  }, []);

  function showLines(canvas: Canvas, onComplete: () => void) {
    const objOption = { stroke: LINE_COLOR, };

    // 上面的线从左到右
    const topLine = new fabric.Line([0, SCALE, 0, SCALE], objOption);
    // 下面的线从右到左
    const BottomLine = new fabric.Line([canvasWidth, canvasHeight - SCALE, canvasWidth, canvasHeight - SCALE], objOption);

    const toRightBottomA = new fabric.Line([0, 0, 0, 0], objOption);
    const toRightBottomB = new fabric.Line([SCALE * 2, 0, SCALE * 2, 0], objOption);
    const toLeftBottomA = new fabric.Line([canvasWidth, 0, canvasWidth, 0], objOption);
    const toLeftBottomB = new fabric.Line([canvasWidth - SCALE * 2, 0, canvasWidth - SCALE * 2, 0], objOption);
    const topCenterToRight = new fabric.Line([canvasWidth / 2 - SCALE, 0, canvasWidth / 2 - SCALE, 0], objOption);
    const topCenterToLeft = new fabric.Line([canvasWidth / 2 + SCALE, 0, canvasWidth / 2 + SCALE, 0], objOption);

    canvas.add(topLine);
    canvas.add(BottomLine);
    canvas.add(toRightBottomA);
    canvas.add(toRightBottomB);
    canvas.add(toLeftBottomA);
    canvas.add(toLeftBottomB);
    canvas.add(topCenterToRight);
    canvas.add(topCenterToLeft);

    const animOption = {
      onChange: canvas.renderAll.bind(canvas),
      duration: 150,
    };
    topLine.animate({
      x2: canvasWidth,
      y2: SCALE,
    }, animOption);
    BottomLine.animate({
      x2: 0,
      y2: canvasHeight - SCALE,
    }, animOption);
    toRightBottomA.animate({
      x2: canvasWidth / 2 + SCALE,
      y2: canvasHeight,
    }, animOption);
    toRightBottomB.animate({
      x2: canvasWidth / 2 + SCALE * 3,
      y2: canvasHeight,
    }, animOption);
    toLeftBottomA.animate({
      x2: canvasWidth / 2 - SCALE,
      y2: canvasHeight,
    }, animOption);
    toLeftBottomB.animate({
      x2: canvasWidth / 2 - SCALE * 3,
      y2: canvasHeight,
    }, animOption);
    topCenterToRight.animate({
      x2: canvasWidth,
      y2: canvasHeight,
    }, animOption);
    topCenterToLeft.animate({
      x2: 0,
      y2: canvasHeight,
    }, {
      onChange: animOption.onChange,
      duration: animOption.duration,
      onComplete: onComplete,
    });
  }

  function showAllTriangles(canvas: Canvas, triangles: Object[], show: boolean) {
    triangles.forEach(e => {
      e.set({ opacity: show ? 1 : 0, });
    });
    canvas.renderAll();
  }

  function trianglesFadeIn(canvas: Canvas, triangles: Object[], show: boolean) {
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        const triangle = removeRandomElement(triangles);
        if (triangle != null) {
          triangle.set({ opacity: show ? 1 : 0 });
          // canvas.remove(triangle);
        }
      }
      canvas.renderAll();
      trianglesFadeIn(canvas, triangles, show);
    }, 50);
  }

  // 从数组中随机删除一个元素，并返回此元素
  function removeRandomElement<T>(arr: T[]): T | null {
    if (arr.length <= 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr.splice(randomIndex, 1)[0];
  }

  // 创建一个直角三角形
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
        opacity: 0,
      });
    }
  }

  // 创建一个垂直翻转的直角三角形
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
        strokeWidth: 1,
        stroke: BORDER_COLOR,
        opacity: 0,
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
