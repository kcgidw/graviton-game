import {Board} from '../game-core/Board';	// TODO webpack to es5
import { ClientFacade } from './ClientFacade';

const fps = 30;
var board: Board = new Board(fps);
var logicWidth = board.dimensions.width;
var logicHeight = board.dimensions.height;

let app = new PIXI.Application({width: logicWidth, height: logicHeight});
// app.renderer.autoResize = true;

// scale the pixi app and its stage
let scale = 0.4;
app.renderer.resize(logicWidth * scale, logicHeight * scale);
app.stage.scale = new PIXI.Point(scale, scale);

let container = document.getElementById('game-wrapper');
container.appendChild(app.view)
	.setAttribute('id', 'game-app');

var facade: ClientFacade;
var now: number;
var lastTime: number;
var delta: number = 0;		// elapsed time
const gameStepInterval = 1000/fps;
const maxCatchup = 1000 * 1000;	// cap on catchup steps

function mainStep() {
	now = timestamp();
	delta += now - lastTime;
	// delta = delta > maxCatchup ? maxCatchup : delta;

	while(delta > gameStepInterval) {
		// when enough time has elapsed, trigger game step(s)
		// console.log(delta, gameStepInterval);
		board.step(delta);
		delta -= gameStepInterval;
	}

	facade.draw();

	lastTime = now;
	requestAnimationFrame(mainStep);
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
	.load(()=> {
		// begin game
		facade = new ClientFacade(board, app);
		lastTime = timestamp();
		mainStep();
	});

function timestamp(): number {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
