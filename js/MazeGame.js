import { Maze } from './MazeRandom.js'
import { DrawMaze } from './CanvasDraw.js'

const LEVEL_LISTS = [4, 7, 10] //三关

class MazeGame {
  constructor(element, callback) {
    this.maze = undefined
    this.element = element
    this.canvasDraw = undefined
    this.level = 0
    this.callback = callback
  }
	getMatrix(){
		let number = LEVEL_LISTS[this.level]

    this.maze = new Maze(number, number)
    this.maze.generate()

    let matrix = this.maze.getMatrix()
    //入口和出口设置为0，通路
    let row = matrix.length,
      col = matrix[0].length
    matrix[1][0] = 0
    matrix[row - 2][col - 1] = 0

		return matrix;
	}
  start() {
   
		const matrix = this.getMatrix();
    this.canvasDraw = new DrawMaze(matrix, this.element)

    this.canvasDraw.draw().then((data) => {
      console.log('通过：', data)
      this.level++
      this.updateView()
    })
  }

  updateView() {
    if (this.level > 2) {
      console.log('全通关了 亲亲')
      this.callback()
      return
    }
		
		const matrix = this.getMatrix();

    this.canvasDraw.updateCanvas(matrix)

    this.canvasDraw.draw().then((data) => {
      console.log('通过：', data)
      this.level++
      this.updateView()
    })
  }
}

export { MazeGame }
