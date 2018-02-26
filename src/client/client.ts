import {Board, BOARD_DIMENSIONS} from '../game-core/Board';	// TODO webpack to es5
import { ClientFacade } from './ClientFacade';
import { Round } from '../game-core/Round';
import {BlockColor} from '../game-core/BlockTypes';
import {Planet} from '../game-core/Planet';

var fps = 30;
var logicWidth = BOARD_DIMENSIONS.width;
var logicHeight = BOARD_DIMENSIONS.height;

var game = new Round(fps);
var board: Board;
var facade: ClientFacade;

let app = new PIXI.Application({width: logicWidth, height: logicHeight});
// app.renderer.autoResize = true;

// scale the pixi app and its stage
let scale = 0.4;
app.renderer.resize(logicWidth * scale, logicHeight * scale);
app.stage.scale = new PIXI.Point(scale, scale);

let container = document.getElementById('game-wrapper');
container.appendChild(app.view)
	.setAttribute('id', 'game-app');

var now: number;
var lastTime: number;
var delta: number = 0;		// elapsed time
const gameStepInterval: number = 1000 / fps;
const maxCatchup: number = 3 * 1000;	// cap on catchup steps

function mainStep() {
	now = timestamp();
	delta += now - lastTime;
	delta = delta > maxCatchup ? maxCatchup : delta;

	let numSteps = 0;
	while(delta > gameStepInterval) {
		// when enough time has elapsed, trigger game step(s)
		// console.log(delta, gameStepInterval);
		board.step();
		delta -= gameStepInterval;
		numSteps++;
	}

	facade.draw();

	lastTime = now;
	requestAnimationFrame(mainStep);
}

function beginRound() {
	board = game.createBoard(new Planet({}, {
		RED: 6,
		YELLOW: 5,
		PURPLE: 5,
		MINT: 2,
		PINK: 2,
	}));
	facade = new ClientFacade(board, app);
	board.setFacade(facade);
	lastTime = timestamp();
	mainStep();
}

PIXI.loader
	.add('red',		'assets/images/red.png')
	.add('yellow',	'assets/images/yellow.png')
	.add('mint',	'assets/images/mint.png')
	.add('forest',	'assets/images/forest.png')
	.add('aqua',	'assets/images/aqua.png')
	.add('purple',	'assets/images/purple.png')
	.add('brown',	'assets/images/brown.png')
	.add('pink',	'assets/images/pink.png')
	.load(beginRound);

function timestamp(): number {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
