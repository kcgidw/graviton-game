import {Board} from '../game-core/board';	// TODO webpack to es5

let container = document.getElementById('game-container');
let app = new PIXI.Application({width: 100, height: 800});
container.appendChild(app.view);

console.log(new Board());