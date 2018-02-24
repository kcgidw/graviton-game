import {Board} from '../game-core/Board';	// TODO webpack to es5
import { ClientFacade } from './ClientFacade';

let container = document.getElementById('game-container');
let app = new PIXI.Application({width: 360, height: 640});
container.appendChild(app.view);

var board: Board = new Board();
console.log(board);

var facade: ClientFacade = new ClientFacade(board, app);

function mainLoop(stamp?: any) {
	board.step();
	facade.draw();
	requestAnimationFrame(mainLoop);
}
mainLoop();
