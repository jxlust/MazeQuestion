import { DIRECT_OPT, randomNumber } from "./MazeUtil.js";

//图的邻接矩阵{G,V};
//图G的顶点v0,v1,... v(row*col-1);
// V = [
// 	  0 1 0 1 0 0
// 		1 0 1 0 0 1
// 		...
//  ]
//这种稀疏的邻接矩阵有个缺点，存的0太多了，矩阵大小太大，存的无用信息过多

//利用普通矩阵，对墙的数据也加入进来，总的行或列 2 * X + 1;

class MazePrim {
  constructor(row, col) {
    if (row < 1 || col < 1) {
      throw new Error("The length is at least 1");
    }
    this.row = row;
    this.col = col;
    this.totalCount = row * col;
    //每个点可以看成一棵树，整个是森林
    //实际的点设置为奇数，因为边是墙的原因
    this.mRow = 2 * row + 1;
    this.mCol = 2 * col + 1;
    this.matrix = [];

    this.path = [];
    this.createMatrix();
  }

  createMatrix() {
    let { matrix } = this;
    //每个点可以看成一棵树，整个是森林
    //实际的点设置为奇数，因为边是墙的原因
    let r = this.mRow;
    let c = this.mCol;

    for (let i = 0; i < r; i++) {
      matrix[i] = new Array(c);
      for (let j = 0; j < c; j++) {
        if (i % 2 === 1 && j % 2 === 1) {
          matrix[i][j] = 0;
        } else {
          matrix[i][j] = 1;
        }
      }
    }
  }

  generate() {
    console.time('start');
    const { row, col, matrix, totalCount } = this;

    const wallData = [];

    const pStatus = new Array(totalCount).fill(0);
    const visited = [];

    let point = randomNumber(totalCount);
    visited.push(point);
    pStatus[point] = 1;

    while (visited.length < totalCount) {
      let rIndex = randomNumber(visited.length);
      let p = visited[rIndex];

      let px = (p / col) | 0;
      let py = p % col;
      let obj = this.getCheckPoints(px, py, row, col, pStatus);

      if(obj){
        let wallX = 2 * px + 1 + obj.x;
        let wallY = 2 * py + 1 + obj.y;
        matrix[wallX][wallY] = 0;
        wallData.push({
            x: wallX,
            y: wallY
        })
        visited.push(obj.newp);
        pStatus[obj.newp] = 1;
      }

    }

    console.timeEnd('start');

    return wallData;
  }

  getCheckPoints(px, py, row, col, pointsStatus) {
    let p = [];
    for (let { x, y } of DIRECT_OPT) {
      let newx = px + x;
      let newy = py + y;
      let newp = newx * col + newy;

      if (
        newx >= 0 &&
        newx < row &&
        newy >= 0 &&
        newy < col &&
        pointsStatus[newp] === 0
      ) {
        p.push({
          newp,
          x,
          y,
        });
      }
    }
    if (p.length) {
      let index = randomNumber(p.length);
      return p[index];
    } else {
      return null;
    }
  }

  getMatrix() {
    return this.matrix;
  }
}

export default MazePrim;
