import {Board} from '../game-core/Board';

export class BoardView {
    board: Board;
    app: PIXI.Application;
    constructor(board: Board, app: PIXI.Application) {
        this.board = board;
        this.app = app;
    }
    draw(): void {
        console.log(this.board);
    }
}