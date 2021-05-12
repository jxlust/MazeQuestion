import {
    bfsFindPath,
    randInt,
    shuffleArray,
    DIRECT_TWO
} from './MazeUtil.js'

//抽象 边 对象
function Edge(b, e, w) {
    this.begin = b; //边的起点
    this.end = e; //边的终点
    this.wight = w; //边的权值
}

class UnionFind {
    constructor(n) {
        //连通分量个数（森林个数）
        // this.count = n;
        //节点x的父节点parent[x]
        this.parent = [];
        //初始化
        for (let i = 0; i < n; i++) {
            this.parent[i] = i;
        }
    }
    findRoot(x){
        while(this.parent[x] !== x){
            // x = this.parent[x];
            //路径隔代压缩
            this.parent[x] = this.parent[this.parent[x]];
            x = this.parent[x];
        }
        return x;
    }
    //判断两棵树是否连通
    isConnected(p,q){
        let pRoot = this.findRoot(p);
        let qRoot = this.findRoot(q);
        return pRoot === qRoot;
    }
    union(p,q){
        //连通两棵树
        if(this.isConnected(p,q)) return;
        this.parent[q] = p;
    }
    connect(p,q){
        this.parent[q] = p;
    }
}

/**
 * 最小生成树算法之一
 * 1. 拿到边集，迷宫的边权重都可以看出0
 * 2. 为了保证随机性，边集合随机重排
 * 3. 创建并查集
 * 4. 遍历边集合，判断边两端树(节点)的连通性
 * 5. 不连通，连通两棵树，并且打墙，形成通路
 */

class MazeKruskal {
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

        this.graphLists = []; //边集合
        this.path = [];
        this.createMatrix();
        this.initGraphLists();
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

    initGraphLists() {
        const {
            graphLists,
            row,
            col
        } = this;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                //避免重复，只访问右和下的邻接节点即可
                //(i,j) => (i+1,j) (i,j+1)
                let begin = i * col + j;
                for (let [x, y] of DIRECT_TWO) {
                    let nextx = i + x,
                        nexty = j + y;
                    if (nextx < row && nexty < col) {
                        let end = nextx * col + nexty;
                        graphLists.push(new Edge(begin, end, 0))
                    }
                }

            }
        }
        //随机化一下边集
        shuffleArray(this.graphLists);
    }
   async generate(callback) {
        const {row,col,totalCount,graphLists,matrix} = this;
        //并查集
        const wallData = [];
        let uf = new UnionFind(totalCount);
        for(let {begin,end} of graphLists){
            let bRoot = uf.findRoot(begin);
            let eRoot = uf.findRoot(end);
            if(bRoot !== eRoot){
                //连通两个树
                uf.connect(bRoot,eRoot);
                //打墙，原矩阵墙位置设置0
                let bx = begin / col | 0;
                let by = begin % col;

                let ex = end / col | 0;
                let ey = end % col;
                
                let wallx = 2 * bx + 1 + (ex - bx);
                let wally = 2 * by + 1 + (ey - by);
                matrix[wallx][wally] = 0;
                 //回调更新视图
                 typeof callback === 'function' && await callback.call(this,wallx,wally);

                wallData.push({
                    x: wallx,
                    y: wally
                })

            }
        }
        return wallData;

    }
    getMatrix() {
		return this.matrix;
	}

}


export default MazeKruskal;