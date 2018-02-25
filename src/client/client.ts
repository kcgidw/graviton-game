import {Board} from '../game-core/Board';	// TODO webpack to es5
import { ClientFacade } from './ClientFacade';

var board: Board = new Board();
var logicWidth = board.dimensions.width;
var logicHeight = board.dimensions.height;

let container = document.getElementById('game-wrapper');
let app = new PIXI.Application({width: logicWidth, height: logicHeight});
// app.renderer.autoResize = true;

// scale the pixi app and its stage
let scale = 0.4;
app.renderer.resize(logicWidth * scale, logicHeight * scale);
app.stage.scale = new PIXI.Point(scale, scale);
container.appendChild(app.view)
	.setAttribute('id', 'game-app');

PIXI.loader
	.add('red',		'assets/images/red.png')
	.add('yellow',	'assets/images/yellow.png')
	.add('mint',	'assets/images/mint.png')
	.add('aqua',	'assets/images/aqua.png')
	.add('purple',	'assets/images/purple.png')
	.load(()=> {
		var facade: ClientFacade = new ClientFacade(board, app);

		function mainLoop(stamp?: any) {
			board.step();
			facade.draw();
			requestAnimationFrame(mainLoop);
		}
		mainLoop();
	});
