import {Maze} from './MazeDfsStack.js'
const CELL_WIDTH = 20;
const LINE_WIDTH = 2;
const HALF_WIDTH = 1;

//定义球体对象
function Ball({
	x = 20,
	y = 20,
	radius = 12
} = {}) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = 'skyblue';

	this.draw = function (ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

class CanvasMaze {
	constructor(row,col, wrap) {
		if (row < 1 || col < 1) {
			throw new Error('The length is at least 1');
		}

		this.wrap = wrap;
		this.row = row;
        this.col = col;

		this.canvas = undefined;
		this.ctx = undefined;
		//如果canvas不存在，需要自己初始化一个
		this.initCanvas();
	}
	initCanvas() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.col * CELL_WIDTH + (this.col + 1) * LINE_WIDTH;
		this.canvas.height = this.row * CELL_WIDTH + (this.row + 1) * LINE_WIDTH;
		if (!!this.wrap) {
			if (typeof this.wrap === 'string') {
				let wrapDom = document.querySelector(this.wrap);
				wrapDom && wrapDom.appendChild(this.canvas);
			} else if (this.wrap instanceof HTMLElement) {
				this.wrap.appendChild(this.canvas);
			}
		} else {
			document.body.appendChild(this.canvas);
		}
	}

    drawGird(){
        const {row,col,ctx} = this;

         // 设置虚线
        //  ctx.setLineDash([5,10])
         ctx.lineWidth = LINE_WIDTH;
         ctx.strokeStyle = '#888';
         //画横线
         let width = col * CELL_WIDTH;
         let height = row * CELL_WIDTH;
         for(let i = 0; i <= row; i++){
             ctx.beginPath();
             ctx.moveTo(0,i * CELL_WIDTH + HALF_WIDTH);
             ctx.lineTo(width + HALF_WIDTH,i * CELL_WIDTH + HALF_WIDTH);
             ctx.stroke();
         }
         ctx.beginPath();
         ctx.strokeStyle = 'red';
         ctx.setLineDash([]);
         for(let j = 0; j <= col; j++){
             ctx.beginPath();
             ctx.moveTo(j * CELL_WIDTH + HALF_WIDTH,0)
             ctx.lineTo(j * CELL_WIDTH + HALF_WIDTH,height + HALF_WIDTH);
             ctx.stroke();
         }

         let maze = new Maze(row,col);
         let matrix = maze.getMatrix();

         //拆墙法
         for(let i = 0; i < matrix.length; i++){
             for(let j = 0; j < matrix[0].length; j++){
                 if(i % 2 === 1 && j % 2 === 1){
                     continue;
                 }
                 if(matrix[i][j] === 0){
                     //拆墙
                     if(i % 2 === 1){
                         //拆纵向的墙
                         ctx.clearRect(((j / 2) | 0 ) * CELL_WIDTH,((i / 2) | 0) * CELL_WIDTH + LINE_WIDTH ,LINE_WIDTH,CELL_WIDTH - LINE_WIDTH);
                     }else{
                         //拆横向的墙
                         ctx.clearRect(((j / 2) | 0 ) * CELL_WIDTH + LINE_WIDTH,((i / 2) | 0) * CELL_WIDTH ,CELL_WIDTH - LINE_WIDTH,LINE_WIDTH);
                     }
                    
                 }
             }
         }

    }

	updateCanvas(matrix) {
	 
	}

	async draw() {
	 

	}


	initEvent() {

	}


}

export {
	CanvasMaze
}