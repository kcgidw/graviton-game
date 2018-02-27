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
const gameScreenRatio = logicWidth / logicHeight;
let scale = 0.6;
app.stage.scale = new PIXI.Point(scale, scale);
function resizeRenderer() {
	// TODO reimplement: https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html
	let clientW = window.innerWidth;
	let clientH = window.innerHeight;
	let w, h;

	if (clientW / clientH >= gameScreenRatio) {
		w = clientH * gameScreenRatio;
		h = clientH;
	} else {
		w = clientW;
		h = clientW / gameScreenRatio;
	}

	app.renderer.view.style.width = w + 'px';
	app.renderer.view.style.height = h + 'px';
}
resizeRenderer();
window.onresize = resizeRenderer;

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

	requestAnimationFrame(mainStep);

	lastTime = now;
	facade.draw();
}

function beginRound() {
	board = game.createBoard(new Planet({}, {
		YELLOW: 28,
		RED: 25,
		PURPLE: 25,
		PINK: 12,
		MINT: 10,
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
