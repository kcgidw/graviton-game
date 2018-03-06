import { Board } from '../game-core/Board';	// TODO webpack to es5
import { ClientFacade } from './ClientFacade';
import { Round } from '../game-core/Round';
import { BlockColor } from '../game-core/BlockColor';
import { Planet } from '../game-core/Planet';

var fps = 30;
var game = new Round(fps);
(<any>window).game = game;
var board: Board;
var facade: ClientFacade;

const canvasW = 720;
const canvasH = 1280;
const gameAspectRatio = canvasW / canvasH;
var app = new PIXI.Application({ width: canvasW, height: canvasH });
// app.renderer.autoResize = true;
// scale the pixi app and its stage
function resizeRenderer() {
	// TODO reimplement: https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html
	let winW = window.innerWidth;
	let winH = window.innerHeight;
	let newW, newH;

	if (winW / winH >= gameAspectRatio) {
		newW = winH * gameAspectRatio;
		newH = winH;
	} else {
		newW = winW;
		newH = winW / gameAspectRatio;
	}
	// canvas resize
		// app.renderer.view.width = window.innerWidth;
		// app.renderer.view.height = window.innerHeight;
	// css scale
	app.renderer.view.style.width = newW + 'px';
	app.renderer.view.style.height = newH + 'px';
	// stage scale
		// var stageScale = newW / app.renderer.width;
		// app.stage.scale = new PIXI.Point(stageScale, stageScale);
}
resizeRenderer();
window.onresize = resizeRenderer;

var container = document.getElementById('game-wrapper');
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
	while (delta > gameStepInterval) {
		// when enough time has elapsed, trigger game step(s)
		// console.log(delta, gameStepInterval);
		board.step();
		delta -= gameStepInterval;
		numSteps++;
	}

	requestAnimationFrame(mainStep);

	lastTime = now;
	facade.step();
}

function beginRound() {
	board = game.createBoard(new Planet({
		columns: 9,
		physics: {},
		colors: {
			YELLOW: 28,
			RED: 25,
			PURPLE: 25,
			PINK: 12,
			MINT: 10,
		},
	}));
	// board.debugMaxBlocks = 100;
	facade = new ClientFacade(board, app);
	board.setFacade(facade);
	lastTime = timestamp();
	mainStep();
}

PIXI.loader
	.add('red', 'assets/images/red.png')
	.add('yellow', 'assets/images/yellow.png')
	.add('mint', 'assets/images/mint.png')
	.add('forest', 'assets/images/forest.png')
	.add('aqua', 'assets/images/aqua.png')
	.add('purple', 'assets/images/purple.png')
	.add('brown', 'assets/images/brown.png')
	.add('pink', 'assets/images/pink.png')
	.add('cursor', 'assets/images/highlight.png')
	.load(beginRound);

function timestamp(): number {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
