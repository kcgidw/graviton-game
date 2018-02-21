import {Board} from '../game-core/Board';	// TODO webpack to es5
import { BoardView } from './BoardView';

let container = document.getElementById('game-container');
let app = new PIXI.Application({width: 100, height: 800});
container.appendChild(app.view);

var board: Board = new Board();
console.log(board);

var boardView: BoardView = new BoardView(board, app);

function mainLoop(stamp?: any) {
    board.step();
    boardView.draw();
    requestAnimationFrame(mainLoop);
}
mainLoop();