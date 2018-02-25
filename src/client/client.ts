import {Board} from '../game-core/Board';	// TODO webpack to es5
import { ClientFacade } from './ClientFacade';

var board: Board = new Board();
var logicWidth = board.dimensions.width;
var logicHeight = board.dimensions.height;

let container = document.getElementById('game-container');
let app = new PIXI.Application({width: logicWidth, height: logicHeight});
// app.renderer.autoResize = true;

// scale the pixi app and its stage
let scale = 0.5;
app.renderer.resize(logicWidth * scale, logicHeight * scale);
app.stage.scale = new PIXI.Point(scale, scale);

function mainLoop(stamp?: any) {
	board.step();
	facade.draw();
	requestAnimationFrame(mainLoop);
}

const loader = PIXI.loader;
loader.add('red', 'assets/images/red.png')
.load(()=> {
	mainLoop();
});



container.appendChild(app.view).setAttribute('id', 'gameApp');

var facade: ClientFacade = new ClientFacade(board, app);
