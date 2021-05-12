import { Maze } from "./MazeDfsStack.js";
import MazeKruskal from "./MazeKruskal.js";
import {Maze as MazeRandom} from './MazeRandom.js';
import { bfsFindPath } from "./MazeUtil.js";
const CELL_WIDTH = 20;
const LINE_WIDTH = 2;
const HALF_WIDTH = 1;
const DFS_KEY = "dfs";
const PRIM_KEY = "prim";
const KRUSKAL_KEY = "kruskal";

//定义球体对象
function Ball({ x = 20, y = 20, radius = 12 } = {}) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = "skyblue";

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  };
}

class CanvasMaze {
  constructor(row, col, type = DFS_KEY, wrap) {
    if (row < 1 || col < 1) {
      throw new Error("The length is at least 1");
    }

    this.wrap = wrap;
    this.row = row;
    this.col = col;
    this.type = type;

    this.canvasWidth = this.col * CELL_WIDTH + (this.col + 1) * LINE_WIDTH;
    this.canvasHeight = this.row * CELL_WIDTH + (this.row + 1) * LINE_WIDTH;

    this.matrix = [];
    this.drawIng = false;

    this.canvas = undefined;
    this.ctx = undefined;
    //如果canvas不存在，需要自己初始化一个
    this.initCanvas();
  }
  initCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    if (!!this.wrap) {
      if (typeof this.wrap === "string") {
        let wrapDom = document.querySelector(this.wrap);
        wrapDom && wrapDom.appendChild(this.canvas);
      } else if (this.wrap instanceof HTMLElement) {
        this.wrap.appendChild(this.canvas);
      }
    } else {
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
  }

  drawGird() {
    if (this.drawIng) return;
    const { row, col, ctx, canvasWidth, canvasHeight } = this;

    //清空画板
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // 设置虚线
    //  ctx.setLineDash([5,10])
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = "#888";
    //画横线
    let width = col * CELL_WIDTH;
    let height = row * CELL_WIDTH;
    for (let i = 0; i <= row; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_WIDTH + HALF_WIDTH);
      ctx.lineTo(width + HALF_WIDTH, i * CELL_WIDTH + HALF_WIDTH);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.strokeStyle = "skybule";
    ctx.setLineDash([]);
    for (let j = 0; j <= col; j++) {
      ctx.beginPath();
      ctx.moveTo(j * CELL_WIDTH + HALF_WIDTH, 0);
      ctx.lineTo(j * CELL_WIDTH + HALF_WIDTH, height + HALF_WIDTH);
      ctx.stroke();
    }

    this.clearWall();
  }
  clearWallByArray(array, ctx) {
    //拆墙法
    for (let { x, y } of array) {
      //拆墙
      if (x % 2 === 1) {
        //拆纵向的墙
        ctx.clearRect(
          ((y / 2) | 0) * CELL_WIDTH,
          ((x / 2) | 0) * CELL_WIDTH + LINE_WIDTH,
          LINE_WIDTH,
          CELL_WIDTH - LINE_WIDTH
        );
      } else {
        //拆横向的墙
        ctx.clearRect(
          ((y / 2) | 0) * CELL_WIDTH + LINE_WIDTH,
          ((x / 2) | 0) * CELL_WIDTH,
          CELL_WIDTH - LINE_WIDTH,
          LINE_WIDTH
        );
      }
    }
  }
  clearWall() {
    const { row, col, type } = this;
    let maze = undefined;
    if (type === DFS_KEY) {
      maze = new Maze(row, col);
      this.dfsGenerate(maze);
    } else if (type === KRUSKAL_KEY) {
      maze = new MazeKruskal(row, col);
      this.kruskalGenerate(maze);
    } else if (type === PRIM_KEY) {
        maze = new MazeRandom(row,col);
        this.drawIng = true;
        let data = maze.generate();
        this.matrix = maze.getMatrix();
        this.clearAnimation(data);
    }
  }
  dfsGenerate(maze) {
    const { ctx } = this;

    this.drawIng = true;
    maze
      .generate(async (i, j) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (i % 2 === 1) {
              //拆纵向的墙
              ctx.clearRect(
                ((j / 2) | 0) * CELL_WIDTH,
                ((i / 2) | 0) * CELL_WIDTH + LINE_WIDTH,
                LINE_WIDTH,
                CELL_WIDTH - LINE_WIDTH
              );
            } else {
              //拆横向的墙
              ctx.clearRect(
                ((j / 2) | 0) * CELL_WIDTH + LINE_WIDTH,
                ((i / 2) | 0) * CELL_WIDTH,
                CELL_WIDTH - LINE_WIDTH,
                LINE_WIDTH
              );
            }
            resolve();
          }, 10);
        });
      })
      .then((data) => {
        console.log("绘制完成了:", data);
        this.drawIng = false;
        this.matrix = maze.getMatrix();
      });
  }

  kruskalGenerate(maze) {
    this.drawIng = true;
    maze.generate().then((data) => {
      this.matrix = maze.getMatrix();
      this.clearAnimation(data);
    });
  }

  clearAnimation(array) {
    const { ctx } = this;
    function clearIndex({x, y}) {
      if (x % 2 === 1) {
        //拆纵向的墙
        ctx.clearRect(
          ((y / 2) | 0) * CELL_WIDTH,
          ((x / 2) | 0) * CELL_WIDTH + LINE_WIDTH,
          LINE_WIDTH,
          CELL_WIDTH - LINE_WIDTH
        );
      } else {
        //拆横向的墙
        ctx.clearRect(
          ((y / 2) | 0) * CELL_WIDTH + LINE_WIDTH,
          ((x / 2) | 0) * CELL_WIDTH,
          CELL_WIDTH - LINE_WIDTH,
          LINE_WIDTH
        );
      }
    }
    let aLength = array.length;
    let count = 0;
    let that = this;
    function clearRequest(timestamp) {
      if (count < aLength) {
        clearIndex(array[count++]);
        window.requestAnimationFrame(clearRequest);
      } else {
        that.drawIng = false;
      }
    }
    window.requestAnimationFrame(clearRequest);
  }

  drawPathLine() {
    if (this.drawIng) return;
    const { ctx } = this;
    let path = bfsFindPath(this.matrix);
    //绘制路线
    console.log(11, path);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;

    ctx.beginPath();
    // ctx.moveTo(0,0);
    // for (let {
    //         x,
    //         y
    //     } of path) {
    //     // (x-1) / 2  <==> 2 * ox + 1 = x;
    //     let ox = (x / 2) | 0;
    //     let oy = (y / 2) | 0;
    //     ctx.lineTo((oy + 0.5) * CELL_WIDTH, (ox + 0.5) * CELL_WIDTH);
    //     ctx.stroke();
    // }
    const len = path.length;
    let startTime = undefined;
    // const totalTime = 3000;
    let count = 0;
    const that = this;

    function drawLine(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
      if (count < len) {
        let { x, y } = path[count];
        let ox = (x / 2) | 0;
        let oy = (y / 2) | 0;
        ctx.lineTo((oy + 0.5) * CELL_WIDTH, (ox + 0.5) * CELL_WIDTH);
        ctx.stroke();
        count++;
        window.requestAnimationFrame(drawLine);
      } else {
        that.drawIng = false;
      }
    }
    this.drawIng = true;
    window.requestAnimationFrame(drawLine);
  }
  updateCanvas(matrix) {}
}

export { CanvasMaze };
