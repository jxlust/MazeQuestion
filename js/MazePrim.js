import {
    shuffleArray,
    DIRECT_TWO
} from './MazeUtil.js'
class MazePrim{
    constructor(row, col) {
        if (row < 1 || col < 1) {
            throw new Error('The length is at least 1');
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
        let {
            matrix
        } = this;
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

}

export default MazePrim;