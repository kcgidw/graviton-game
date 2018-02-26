/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = __webpack_require__(5);
const Box2d_1 = __webpack_require__(6);
const YHitbox_1 = __webpack_require__(1);
const util_1 = __webpack_require__(2);
/* TODO
- Load a cache of block objects?
*/
exports.BOARD_DIMENSIONS = new Box2d_1.Box2d(0, 0, 1280, 720);
class Board {
    constructor(engine, planet, facade) {
        this.dimensions = exports.BOARD_DIMENSIONS;
        this.numRows = 12;
        this.numColumns = 9;
        this.colors = [];
        this.blocks = [];
        this.spawnInterval = 0.4 * 1000;
        this.blockId = 0;
        this.tick = 0;
        this.time = 0;
        this.engine = engine;
        this.planet = planet;
        for (let i = 0; i < this.numColumns; i++) {
            this.blocks.push([]);
        }
        this.facade = facade;
        this.ground = new YHitbox_1.YHitbox(this.dimensions.getBottom(), 100);
        let spawnerInterval = 1 * 1000;
        this.spawner = new Timer(this, () => {
            this.spawnBlockRandom();
        }, spawnerInterval, true).start();
    }
    forEachBlock(fn) {
        this.blocks.forEach((col) => {
            col.forEach((block, idx) => {
                fn(block, idx);
            });
        });
    }
    step() {
        this.time += this.engine.stepInterval;
        this.forEachBlock((block, idx) => {
            // block physics
            block.hitbox.top = block.hitbox.top + (block.curVelocity * this.engine.BASE_LOGICAL_FPS / this.engine.stepInterval);
            if (idx === 0 && block.hitbox.collidesBelow(this.ground)) {
                block.hitbox.moveToContact(this.ground);
            }
            else {
                let nextBlock = this.blocks[block.columnIdx][idx - 1];
                if (nextBlock && block.hitbox.collidesBelow(nextBlock.hitbox)) {
                    block.hitbox.moveToContact(nextBlock.hitbox);
                }
            }
        });
        this.tick++;
        this.spawner.step();
    }
    // Returns the next block under this one, even if they aren't in contact
    getNextBlockBelow(block) {
        let colIdx = block.columnIdx;
        let blockIdx = block.blockIdx;
        if (blockIdx === 0) {
            return null;
        }
        return this.blocks[colIdx][blockIdx - 1];
    }
    getRandomColumnIdx() {
        let idx = util_1.randInt(0, this.numColumns);
        return idx;
    }
    spawnBlock(colIdx, color) {
        var col = this.blocks[colIdx];
        var blockIdx = col.length;
        var block = new Block_1.Block(colIdx, blockIdx, color, this.blockId++);
        col.push(block);
        return block;
    }
    spawnBlockRandom() {
        return this.spawnBlock(this.blockId === 0 ? 2 : this.getRandomColumnIdx(), this.planet.getRandomColor());
    }
    setFacade(facade) {
        this.facade = facade;
        return this.facade;
    }
}
exports.Board = Board;
var TimerState;
(function (TimerState) {
    TimerState[TimerState["STOP"] = 0] = "STOP";
    TimerState[TimerState["START"] = 1] = "START";
    TimerState[TimerState["PAUSE"] = 2] = "PAUSE";
})(TimerState || (TimerState = {}));
class Timer {
    constructor(board, action, alarm, repeats) {
        this.state = TimerState.STOP;
        this.time = 0;
        this.repeats = false;
        this.board = board;
        this.action = action;
        this.alarm = alarm;
        this.repeats = repeats;
    }
    stop() {
        this.state = TimerState.STOP;
        this.time = 0;
        return this;
    }
    start() {
        this.state = TimerState.START;
        return this;
    }
    pause() {
        this.state = TimerState.PAUSE;
        return this;
    }
    step() {
        if (this.state === TimerState.START) {
            this.time += this.board.engine.stepInterval;
            if (this.repeats === true) {
                let numTriggers = 0;
                while (this.time > this.alarm) {
                    this.alert();
                    this.time -= this.alarm;
                    numTriggers++;
                }
            }
            else {
                if (this.time > this.alarm) {
                    this.alert();
                    this.stop();
                }
            }
        }
    }
    alert() {
        this.action();
    }
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// position and collision
class YHitbox {
    constructor(top, height) {
        this.top = top;
        this.height = height;
    }
    getBottom() {
        return this.top + this.height;
    }
    collidesBelow(other) {
        if (this.getBottom() >= other.top) {
            return true;
        }
        // does NOT check if this is completely under 'other'
        return false;
    }
    setY(y) {
        this.top = y;
        return this.top;
    }
    setBottom(y) {
        y -= this.height;
        return this.setY(y);
    }
    move(dist) {
        this.top += dist;
        return this.top;
    }
    moveToContact(other) {
        if (this.collidesBelow(other)) {
            let dist = other.top - this.getBottom();
            return this.move(dist);
        }
        return undefined;
    }
}
exports.YHitbox = YHitbox;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function randInt(from, to, inclusive) {
    // inclusive
    var range = to - from;
    var tmp = Math.floor(Math.random() * (range + (inclusive ? 1 : 0)));
    return from + tmp;
}
exports.randInt = randInt;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BlockColor;
(function (BlockColor) {
    BlockColor[BlockColor["RED"] = 0] = "RED";
    BlockColor[BlockColor["YELLOW"] = 1] = "YELLOW";
    BlockColor[BlockColor["MINT"] = 2] = "MINT";
    BlockColor[BlockColor["FOREST"] = 3] = "FOREST";
    BlockColor[BlockColor["AQUA"] = 4] = "AQUA";
    BlockColor[BlockColor["PURPLE"] = 5] = "PURPLE";
    BlockColor[BlockColor["PINK"] = 6] = "PINK";
    BlockColor[BlockColor["BROWN"] = 7] = "BROWN";
})(BlockColor || (BlockColor = {}));
exports.BlockColor = BlockColor;
const COLORS = ['RED', 'YELLOW', 'MINT', 'FOREST', 'AQUA', 'PURPLE', 'PINK', 'BROWN'];
exports.COLORS = COLORS;
function colorToFilename(color) {
    return COLORS[color].toLowerCase();
}
exports.colorToFilename = colorToFilename;
function strToColor(str) {
    var res = BlockColor[str];
    if (res === undefined) {
        throw new Error('strtocolor ' + str);
    }
    return res;
}
exports.strToColor = strToColor;
var BlockType;
(function (BlockType) {
    BlockType[BlockType["NORMAL"] = 0] = "NORMAL";
    BlockType[BlockType["ROCKET"] = 1] = "ROCKET";
    BlockType[BlockType["GARBAGE"] = 2] = "GARBAGE";
})(BlockType || (BlockType = {}));
exports.BlockType = BlockType;
// const BlockColorMap = {
// 	RED: 1,
// 	YELLOW: 2,
// 	MINT: 3,
// 	FOREST: 4,
// 	AQUA: 5,
// 	PURPLE: 6,
// 	PINK: 7,
// 	BROWN: 8,
// 	1: 'RED',
// 	2: 'YELLOW',
// 	3: 'MINT',
// 	4: 'FOREST',
// 	5: 'AQUA',
// 	6: 'PURPLE',
// 	7: 'PINK',
// 	8: 'BROWN',
// };


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = __webpack_require__(0); // TODO webpack to es5
const ClientFacade_1 = __webpack_require__(7);
const Round_1 = __webpack_require__(8);
const Planet_1 = __webpack_require__(9);
var fps = 30;
var logicWidth = Board_1.BOARD_DIMENSIONS.width;
var logicHeight = Board_1.BOARD_DIMENSIONS.height;
var game = new Round_1.Round(fps);
var board;
var facade;
let app = new PIXI.Application({ width: logicWidth, height: logicHeight });
// app.renderer.autoResize = true;
// scale the pixi app and its stage
let scale = 0.4;
app.renderer.resize(logicWidth * scale, logicHeight * scale);
app.stage.scale = new PIXI.Point(scale, scale);
let container = document.getElementById('game-wrapper');
container.appendChild(app.view)
    .setAttribute('id', 'game-app');
var now;
var lastTime;
var delta = 0; // elapsed time
const gameStepInterval = 1000 / fps;
const maxCatchup = 3 * 1000; // cap on catchup steps
function mainStep() {
    now = timestamp();
    delta += now - lastTime;
    if (delta > 1000) {
        console.log(delta);
    }
    delta = delta > maxCatchup ? maxCatchup : delta;
    let numSteps = 0;
    while (delta > gameStepInterval) {
        // when enough time has elapsed, trigger game step(s)
        // console.log(delta, gameStepInterval);
        board.step();
        delta -= gameStepInterval;
        numSteps++;
    }
    console.log(numSteps);
    facade.draw();
    lastTime = now;
    requestAnimationFrame(mainStep);
}
function beginRound() {
    board = game.createBoard(new Planet_1.Planet({}, {
        RED: 5,
        FOREST: 5,
        AQUA: 5,
        YELLOW: 3,
        PINK: 2,
    }));
    facade = new ClientFacade_1.ClientFacade(board, app);
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
    .load(beginRound);
function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const YHitbox_1 = __webpack_require__(1);
// movement
class Block {
    constructor(columnIdx, blockIdx, color, id) {
        this.curVelocity = 30;
        this.matchable = false; // can block be matched with other blocks
        this.columnIdx = columnIdx;
        this.blockIdx = blockIdx;
        this.hitbox = new YHitbox_1.YHitbox(0, 100);
        this.color = color;
        this.id = id;
    }
    // step(): void {
    // 	this.hitbox.move(this.curVelocity);
    // }
    setColor(blockColor) {
        this.color = blockColor;
    }
    isRising() {
        return this.curVelocity > 0;
    }
    isFalling() {
        return this.curVelocity < 0;
    }
    isStationary() {
        return this.curVelocity === 0;
    }
}
exports.Block = Block;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Box2d {
    constructor(top, left, height, width) {
        this.top = top;
        this.left = left;
        this.height = height;
        this.width = width;
    }
    getBottom() {
        return this.top + this.height;
    }
    right() {
        return this.left + this.width;
    }
}
exports.Box2d = Box2d;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BlockTypes_1 = __webpack_require__(3);
class ClientFacade {
    constructor(board, app) {
        this.board = board;
        this.app = app;
        this.blockSprites = new BlockSpriteRegistry(this);
        this.boardContainer = this.app.stage.addChild(new PIXI.Container());
        this.backdropContainer = this.boardContainer.addChild(new PIXI.Container());
        this.blocksContainer = this.boardContainer.addChild(new PIXI.Container());
        let targetBoardWidthRatio = 0.9;
        let tileWidth = PIXI.loader.resources[BlockTypes_1.colorToFilename(BlockTypes_1.BlockColor.RED)].texture.width * this.app.stage.scale.x;
        let baseBoardWidth = tileWidth * this.board.numColumns;
        let targetBoardWidth = this.app.renderer.width * targetBoardWidthRatio;
        let scale = targetBoardWidth / baseBoardWidth;
        this.blocksContainer.scale = new PIXI.Point(scale, scale);
        let logicW = this.board.dimensions.width;
        let logicH = this.board.dimensions.height;
        targetBoardWidth = logicW * targetBoardWidthRatio;
        let targetBoardHeight = logicH * targetBoardWidthRatio;
        let xMargin = (logicW - targetBoardWidth) / 2;
        let yMargin = (logicH - targetBoardHeight) / 2;
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x323333, 1);
        graphics.drawRect(xMargin, yMargin, targetBoardWidth, targetBoardHeight);
        graphics.endFill();
        this.backdropContainer.addChild(graphics);
        this.blocksContainer.x = xMargin;
        this.blocksContainer.y = yMargin;
    }
    draw() {
        this.board.blocks.forEach((column) => {
            column.forEach((block) => {
                let bs = this.blockSprites.get(block);
                if (!bs) {
                    bs = this.addBlock(block);
                }
                bs.updateSpritePosition(block.hitbox.top);
            });
        });
    }
    addBlock(block) {
        // blocksprite's sprite width will start as 0 if texture is loaded on demand,
        // causing draw mistakes. Make sure your stuff is pre-loaded
        let spr = new PIXI.Sprite(PIXI.loader.resources[BlockTypes_1.colorToFilename(block.color)].texture);
        // TODO preload texture http://www.html5gamedevs.com/topic/16019-preload-all-textures/
        this.blocksContainer.addChild(spr);
        let bs = this.blockSprites.register(block, spr);
        return bs;
    }
    removeBlock(block) {
        let bs = this.blockSprites.deregister(block);
        bs.destroy(); // TODO hide and reuse
    }
}
exports.ClientFacade = ClientFacade;
class BlockSpriteRegistry {
    constructor(facade) {
        this.map = {};
        this.facade = facade;
    }
    get(block) {
        return this.map[block.id];
    }
    register(block, sprite) {
        let bs = new BlockSprite(this.facade.board, block, sprite);
        this.map[block.id] = bs;
        return bs;
    }
    deregister(block) {
        let bs = this.get(block);
        delete this.map[block.id];
        return bs;
    }
}
class BlockSprite {
    constructor(board, block, sprite) {
        this.board = board;
        this.block = block;
        this.sprite = sprite;
        this.sprite.x = this.block.columnIdx * this.sprite.width;
        this.debugId = new PIXI.Text(block.id + ' ' + block.columnIdx, { fill: '#ffffff' });
    }
    updateSpritePosition(y) {
        this.sprite.y = y;
        this.sprite.addChild(this.debugId);
    }
    destroy() {
        this.sprite.destroy();
    }
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = __webpack_require__(0);
class Round {
    constructor(stepInterval) {
        this.BASE_LOGICAL_FPS = 60;
        this.stepInterval = stepInterval;
    }
    createBoard(planet) {
        this.board = new Board_1.Board(this, planet);
        return this.board;
    }
}
exports.Round = Round;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BlockTypes_1 = __webpack_require__(3);
const util_1 = __webpack_require__(2);
class Planet {
    constructor(physics, distributions) {
        this.physics = physics;
        this.distributions = distributions;
        this.colors = Object.keys(distributions).map((str) => BlockTypes_1.strToColor(str));
        console.log(this.colors);
    }
    getRandomColor() {
        let sum = 0;
        Object.keys(this.distributions).forEach((color) => {
            sum += this.distributions[color];
        });
        let rng = util_1.randInt(0, sum);
        // TODO
        return BlockTypes_1.BlockColor.RED;
    }
}
exports.Planet = Planet;


/***/ })
/******/ ]);
//# sourceMappingURL=client.bundle.js.map