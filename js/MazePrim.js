import { DIRECT_OPT, randInt } from './MazeUtil.js'

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
      throw new Error('The length is at least 1')
    }
    this.row = row
    this.col = col
    this.totalCount = row * col
    //每个点可以看成一棵树，整个是森林
    //实际的点设置为奇数，因为边是墙的原因
    this.mRow = 2 * row + 1
    this.mCol = 2 * col + 1
    this.matrix = []

    this.path = []
    this.createMatrix()
  }

  createMatrix() {
    let { matrix } = this
    //每个点可以看成一棵树，整个是森林
    //实际的点设置为奇数，因为边是墙的原因
    let r = this.mRow
    let c = this.mCol

    for (let i = 0; i < r; i++) {
      matrix[i] = new Array(c)
      for (let j = 0; j < c; j++) {
        if (i % 2 === 1 && j % 2 === 1) {
          matrix[i][j] = 0
        } else {
          matrix[i][j] = 1
        }
      }
    }
  }

  generate() {
    const { row, col, matrix, totalCount } = this

    const wallData = []

    const pStatus = new Array(totalCount).fill(0)
    const neighbors = new Set() //可供选择的邻居

    let point = 0 //当前点

    neighbors.add({
      begin: 0,
      end: 0,
    })
		
    while (neighbors.size) {
      let randomIndex = randInt(0, neighbors.size)
      let pointObj = [...neighbors][randomIndex]

      if (pointObj.begin !== pointObj.end) {
        //拆墙
				let {begin,end} = pointObj;
				let bx = begin / col | 0;
				let by = begin % col;

				let ex = end / col | 0;
				let ey = end % col;

				let diffx = ex - bx,
				diffy = ey - by;

				let wallX = 2 * bx + 1 + diffx;
				let wallY = 2 * by + 1 + diffy;

				matrix[wallX][wallY] = 0;
				wallData.push({ x: wallX, y: wallY });

      }

      point = pointObj.end
      pStatus[point] = 1
      neighbors.delete(pointObj)

      //当前点
      let px = (point / col) | 0
      let py = point % col

      this.innerNeighbors(px, py, row, col, pStatus, neighbors)
 
    }

    return wallData
  }

  innerNeighbors(px, py, row, col, pointsStatus, neighbors) {
    for (let { x, y } of DIRECT_OPT) {
      let newx = px + x
      let newy = py + y
      let newp = newx * col + newy

      if (
        newx >= 0 &&
        newx < row &&
        newy >= 0 &&
        newy < col &&
        pointsStatus[newp] === 0
      ) {
        neighbors.add({
          begin: px * col + py,
          end: newp,
        })
      }
    }
  }

  getCheckPoints(px, py, row, col, pointsStatus, neighbors) {
    let p = []
    for (let { x, y } of DIRECT_OPT) {
      let newx = px + x
      let newy = py + y
      let newp = newx * col + newy

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
        })
        neighbors.add({
          begin: px * col + py,
          end: newp,
        })
      }
    }
    if (p.length) {
      return p
    } else {
      return null
    }
  }

  getMatrix() {
    return this.matrix
  }
}



export default MazePrim
