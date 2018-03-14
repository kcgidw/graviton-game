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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
})(BlockColor = exports.BlockColor || (exports.BlockColor = {}));
exports.COLORS = ['RED', 'YELLOW', 'MINT', 'FOREST', 'AQUA', 'PURPLE', 'PINK', 'BROWN'];
class BlockColorUtil {
    static colorToFilename(color) {
        return exports.COLORS[color].toLowerCase();
    }
    static colorToTexture(color) {
        return PIXI.loader.resources[this.colorToFilename(color)].texture;
    }
    static strToColor(str) {
        var res = BlockColor[str];
        if (res === undefined) {
            throw new Error('strtocolor ' + str);
        }
        return res;
    }
}
exports.BlockColorUtil = BlockColorUtil;
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BlockType;
(function (BlockType) {
    BlockType[BlockType["NORMAL"] = 0] = "NORMAL";
    BlockType[BlockType["ROCKET"] = 1] = "ROCKET";
    BlockType[BlockType["GARBAGE"] = 2] = "GARBAGE";
})(BlockType = exports.BlockType || (exports.BlockType = {}));


/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ClientFacade_1 = __webpack_require__(4);
const Round_1 = __webpack_require__(6);
const Planet_1 = __webpack_require__(13);
var fps = 30;
var game = new Round_1.Round(fps);
window.game = game;
var board;
var facade;
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
    }
    else {
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
var now;
var lastTime;
var delta = 0; // elapsed time
const gameStepInterval = 1000 / fps;
const maxCatchup = 3 * 1000; // cap on catchup steps
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
    board = game.createBoard(new Planet_1.Planet({
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
    .add('burnt', 'assets/images/burnt.png')
    .add('cursor', 'assets/images/highlight.png')
    .load(beginRound);
function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BlockColor_1 = __webpack_require__(0);
const BlockSprite_1 = __webpack_require__(5);
const targetBoardWidthRatio = 0.95; // ratio of board width to canvas width
var PointerState;
(function (PointerState) {
    PointerState[PointerState["DOWN"] = 0] = "DOWN";
    PointerState[PointerState["UP"] = 1] = "UP";
})(PointerState = exports.PointerState || (exports.PointerState = {}));
class ClientFacade {
    constructor(board, app) {
        this.board = board;
        this.app = app;
        this.blockSprites = new BlockSpriteRegistry(this);
        this.boardContainer = this.app.stage.addChild(new PIXI.Container());
        this.backdropContainer = this.boardContainer.addChild(new PIXI.Container());
        this.blocksContainer = this.boardContainer.addChild(new PIXI.Container());
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x323333, 1);
        graphics.drawRect(0, 0, this.board.dimensions.width, this.board.dimensions.height);
        graphics.endFill();
        this.backdropContainer.addChild(graphics);
        // this.blocksContainer.x = xMargin;
        // this.blocksContainer.y = yMargin;
        this.resizeBoard();
        /* Initialize pointer events */
        this.app.stage.interactive = true;
        this.app.stage.on('pointerup', (eventData) => {
            this.selectBlock(undefined);
        });
        this.app.stage.on('pointerout', (eventData) => {
            this.selectBlock(undefined);
        });
        this.app.stage.on('pointerdown', (eventData) => { });
        this.app.stage.on('pointermove', (eventData) => {
            if (this.selectedBlock) {
                var pointerCoordinates = eventData.data.getLocalPosition(this.boardContainer);
                var pointerY = pointerCoordinates.y;
                if (pointerY < this.selectedBlock.block.hitbox.top) {
                    this.board.swapUp(this.selectedBlock.block);
                }
                else if (pointerY > this.selectedBlock.block.hitbox.getBottom()) {
                    this.board.swapDown(this.selectedBlock.block);
                }
            }
        });
    }
    resizeBoard() {
        var canvasW = this.app.renderer.view.width;
        var canvasH = this.app.renderer.view.height;
        var logicW = this.board.dimensions.width;
        var logicH = this.board.dimensions.height;
        var scale = (canvasW * targetBoardWidthRatio) / logicW;
        this.boardContainer.scale = new PIXI.Point(scale, scale);
        console.log('SCALE ' + scale);
        console.log(this.boardContainer.scale.x + ' ' + this.app.stage.scale.x);
        // reposition board
        var leftMargin = (canvasW - this.boardContainer.width) / 2;
        var topMargin = (canvasH - this.boardContainer.height) / 2;
        this.boardContainer.x = leftMargin;
        this.boardContainer.y = topMargin;
    }
    step() {
        this.draw();
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
        let spr = new PIXI.Sprite(PIXI.loader.resources[BlockColor_1.BlockColorUtil.colorToFilename(block.color)].texture);
        // TODO preload texture http://www.html5gamedevs.com/topic/16019-preload-all-textures/
        this.blocksContainer.addChild(spr);
        let bs = this.blockSprites.register(block, spr);
        return bs;
    }
    removeBlock(block) {
        let bs = this.blockSprites.deregister(block);
        bs.destroy(); // TODO hide and reuse
    }
    selectBlock(bs) {
        this.selectedBlock = bs;
        console.log(bs ? 'selected ' + this.selectedBlock.block.id : ' deselect');
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
        let bs = new BlockSprite_1.BlockSprite(this.facade.board, block, sprite);
        this.map[block.id] = bs;
        return bs;
    }
    deregister(block) {
        let bs = this.get(block);
        delete this.map[block.id];
        return bs;
    }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BlockType_1 = __webpack_require__(1);
const BlockColor_1 = __webpack_require__(0);
class BlockSprite {
    constructor(board, block, sprite) {
        this.board = board;
        this.block = block;
        this.sprite = sprite;
        this.sprite.x = this.block.columnIdx * this.sprite.width;
        this.sprite.interactive = true;
        this.sprite.on('pointerdown', () => {
            this.board.facade.selectBlock(this);
        });
        // debug text
        this.debugId = new PIXI.Text(block.id + '', { fill: '#ffffff' });
        var colText = new PIXI.Text('col ' + block.columnIdx, { fill: '#ffffff' });
        this.debugId.addChild(colText);
        colText.y += 20;
        var slotText = new PIXI.Text('stk ' + block.slotIdx, { fill: '#ffffff' });
        this.debugId.addChild(slotText);
        slotText.y += 40;
        // (<any>this.sprite).__BLOCK = block;
    }
    updateSpritePosition(y) {
        this.sprite.y = y;
        this.sprite.addChild(this.debugId);
    }
    updateTexture() {
        var type = this.block.type;
        switch (type) {
            case BlockType_1.BlockType.NORMAL:
                this.sprite.texture = BlockColor_1.BlockColorUtil.colorToTexture(this.block.color);
                break;
            case BlockType_1.BlockType.ROCKET:
                break;
            case BlockType_1.BlockType.GARBAGE:
                break;
        }
    }
    destroy() {
        this.sprite.destroy();
    }
}
exports.BlockSprite = BlockSprite;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = __webpack_require__(7);
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = __webpack_require__(8);
const Rectangle_1 = __webpack_require__(9);
const YHitbox_1 = __webpack_require__(2);
const util_1 = __webpack_require__(10);
const Timer_1 = __webpack_require__(11);
const matches_1 = __webpack_require__(12);
const BlockType_1 = __webpack_require__(1);
/* TODO
- Load a cache of block objects?
*/
class Board {
    constructor(engine, planet, facade) {
        this.numRows = 12;
        this.colors = [];
        this.blocks = [];
        this.blocksMap = {}; // maps id to block
        this.spawnInterval = 0.05 * 1000;
        this.blockId = 0;
        this.tick = 0;
        this.time = 0;
        this.isDirtyForMatches = false;
        this.compoundMatches = [];
        this.engine = engine;
        this.planet = planet;
        this.numColumns = this.planet.numColumns;
        this.dimensions = new Rectangle_1.Rectangle(0, 0, this.numRows * Block_1.Block.HEIGHT, this.numColumns * Block_1.Block.HEIGHT);
        for (let i = 0; i < this.numColumns; i++) {
            this.blocks.push([]);
        }
        this.facade = facade;
        this.ground = new YHitbox_1.YHitbox(this.dimensions.getBottom(), Block_1.Block.HEIGHT);
        this.spawner = new Timer_1.Timer(this, () => {
            var res = this.spawnBlockRandom();
            if (!res) {
                this.spawner.stop();
            }
        }, this.spawnInterval, true).start();
        console.log(this);
    }
    forEachBlock(fn) {
        this.blocks.forEach((col) => {
            col.forEach((block, idx) => {
                fn(block, idx);
            });
        });
    }
    getBlock(blockId) {
        return this.blocksMap[blockId];
    }
    getBlockAbove(block) {
        if (typeof block === 'number') {
            block = this.getBlock(block);
        }
        let colIdx = block.columnIdx;
        let slotIdx = block.slotIdx;
        return this.blocks[colIdx][slotIdx + 1];
    }
    getBlockBelow(block) {
        if (typeof block === 'number') {
            block = this.getBlock(block);
        }
        let colIdx = block.columnIdx;
        let slotIdx = block.slotIdx;
        return this.blocks[colIdx][slotIdx - 1];
    }
    getBlockDirectBelow(block) {
        var res = this.getBlockBelow(block);
        if (res && res.hitbox.top === block.hitbox.getBottom() + 1) {
            return res;
        }
        return undefined;
    }
    step() {
        this.time += this.engine.stepInterval;
        this.forEachBlock((block, idx) => {
            block.contactBelowPrev = block.contactBelow;
            // block physics
            block.hitbox.top = block.hitbox.top + (block.curVelocity * this.engine.BASE_LOGICAL_FPS / this.engine.stepInterval);
            var hitboxBelow = idx === 0 ? this.ground : this.blocks[block.columnIdx][idx - 1].hitbox;
            if (block.hitbox.collidesBelow(hitboxBelow)) {
                block.hitbox.moveToContact(hitboxBelow);
                block.contactBelow = true;
                if (block.selectable === false) {
                    block.activateSelectable();
                }
                if (block.contactBelowPrev === false) {
                    this.isDirtyForMatches = true;
                }
            }
            else if (!this.getBlockDirectBelow(block)) {
                block.contactBelow = false;
            }
        });
        if (this.isDirtyForMatches) {
            this.compoundMatches = this.processMatches();
            this.isDirtyForMatches = false;
            if (this.compoundMatches) {
                this.compoundMatches.forEach((comp) => {
                    comp.blocks.forEach((blk) => {
                        blk.setType(BlockType_1.BlockType.ROCKET);
                    });
                });
            }
        }
        if (this.debugMaxBlocks && this.blockId > this.debugMaxBlocks) {
            this.spawner.stop();
        }
        else {
            this.spawner.step();
        }
        this.tick++;
    }
    getRandomColumnIdx() {
        let idx = util_1.randInt(0, this.numColumns);
        return idx;
    }
    columnIsFull(colIdx) {
        return this.blocks[colIdx].length >= this.numRows;
    }
    getNonFullColumnsIdxs() {
        var res = [];
        for (let i = 0; i < this.numColumns; i++) {
            if (this.columnIsFull(i) === false) {
                res.push(i);
            }
        }
        return res;
    }
    getRandomNonFullColumnIdx() {
        var openColumns = this.getNonFullColumnsIdxs();
        if (openColumns.length === 0) {
            return undefined;
        }
        var colIdx = openColumns[util_1.randInt(0, openColumns.length)];
        return colIdx;
    }
    spawnBlock(colIdx, color) {
        var col = this.blocks[colIdx];
        var slotIdx = col.length;
        var block = new Block_1.Block(colIdx, slotIdx, BlockType_1.BlockType.NORMAL, this.blockId++)
            .setColor(color);
        col.push(block);
        this.blocksMap[block.id] = block;
        return block;
    }
    spawnBlockRandom() {
        var colIdx = this.getRandomNonFullColumnIdx();
        if (colIdx === undefined) {
            return undefined;
        }
        return this.spawnBlock(colIdx, this.chooseColor(colIdx, this.blocks[colIdx].length));
    }
    getRandomColor() {
        let rng = util_1.rand(0, this.planet.distribSum);
        let colorIdx = 0;
        // console.log('rng ' + rng);
        for (; colorIdx < this.planet.distribArr.length; colorIdx++) {
            rng -= this.planet.distribArr[colorIdx].weight;
            if (rng < 0) {
                break;
            }
        }
        // console.log('   ' + this.distribArr[colorIdx].colorStr);
        return this.planet.distribArr[colorIdx].color;
    }
    chooseColor(colIdx, slotIdx) {
        var color = this.getRandomColor();
        var tried = {};
        while (this.validateColor(colIdx, slotIdx, color) === false) {
            tried[color] = 0;
            // get a new random color that hasn't been tried yet
            while (tried[color] !== undefined) {
                color = this.getRandomColor();
            }
        }
        return color;
    }
    getColorAt(colIdx, slotIdx) {
        var col = this.blocks[colIdx];
        if (col === undefined) {
            return undefined;
        }
        var blk = col[slotIdx];
        return blk ? blk.color : undefined;
    }
    // checks if placing a color at a certain columnXslot could create a natural match-3
    validateColor(colIdx, slotIdx, color) {
        // check horiz
        var slotRange = this.blocks.map((col) => (col[slotIdx]));
        var neighbor0 = this.getColorAt(colIdx - 2, slotIdx);
        var neighbor1 = this.getColorAt(colIdx - 1, slotIdx);
        var neighbor2 = this.getColorAt(colIdx + 1, slotIdx);
        var neighbor3 = this.getColorAt(colIdx + 2, slotIdx);
        if ((neighbor0 === color && neighbor1 === color)
            || (neighbor1 === color && neighbor2 === color)
            || (neighbor2 === color && neighbor3 === color)) {
            return false;
        }
        // check vert
        var colRange = this.blocks[colIdx];
        neighbor0 = this.getColorAt(colIdx, slotIdx - 2);
        neighbor1 = this.getColorAt(colIdx, slotIdx - 1);
        neighbor2 = this.getColorAt(colIdx, slotIdx + 1);
        neighbor3 = this.getColorAt(colIdx, slotIdx + 2);
        if ((neighbor0 === color && neighbor1 === color)
            || (neighbor1 === color && neighbor2 === color)
            || (neighbor2 === color && neighbor3 === color)) {
            return false;
        }
        return true; // no potential matches found
    }
    swapBlocks(a, b) {
        // TODO run within the step logic, not outside it
        if (!a.selectable || !b.selectable) {
            return;
        }
        if (a.columnIdx !== b.columnIdx) {
            return;
        }
        if (Math.abs(a.slotIdx - b.slotIdx) !== 1) {
            return;
        }
        var col = a.columnIdx;
        var tmpA = a;
        var tmpAStackIdx = a.slotIdx;
        var tmpAHitboxTop = a.hitbox.top;
        this.blocks[col][a.slotIdx] = b;
        this.blocks[col][b.slotIdx] = tmpA;
        a.slotIdx = b.slotIdx;
        b.slotIdx = tmpAStackIdx;
        a.hitbox.top = b.hitbox.top;
        b.hitbox.top = tmpAHitboxTop;
        this.isDirtyForMatches = true;
    }
    swapUp(block) {
        var other = this.getBlockAbove(block);
        if (other) {
            this.swapBlocks(block, other);
        }
    }
    swapDown(block) {
        var other = this.getBlockBelow(block);
        if (other) {
            this.swapBlocks(block, other);
        }
    }
    setFacade(facade) {
        this.facade = facade;
        return this.facade;
    }
    processMatches() {
        this.compoundMatches = [];
        this.forEachBlock((blk) => {
            blk.matchInfo = undefined;
        });
        var allMatchBlocks = [];
        /* Generate simple matches */
        for (let colIdx = 0; colIdx < this.numColumns; colIdx++) {
            for (let slotIdx = 0; slotIdx < this.blocks[colIdx].length; slotIdx++) {
                let refBlk = this.blocks[colIdx][slotIdx];
                if (refBlk) {
                    refBlk.matchInfo = refBlk.matchInfo ? refBlk.matchInfo : {};
                    if (refBlk.matchInfo.hor === undefined) {
                        let match = new matches_1.SimpleMatch([refBlk], true);
                        for (let i = colIdx + 1; i < this.numColumns; i++) {
                            let compareBlk = this.blocks[i][slotIdx];
                            if (compareBlk !== undefined && refBlk.hasNormalMatch(compareBlk)) {
                                match.add(compareBlk);
                            }
                            else {
                                break; // non-existent or non-match. No more matches can follow
                            }
                        }
                        // if is a valid simple match, then attach info to each of its blocks
                        if (match.blocks.length >= 3) {
                            match.blocks.forEach((blk) => {
                                blk.matchInfo = blk.matchInfo ? blk.matchInfo : {};
                                blk.matchInfo.hor = match;
                                if (allMatchBlocks.indexOf(blk) === -1) {
                                    allMatchBlocks.push(blk);
                                }
                            });
                        }
                    }
                    if (refBlk.matchInfo.ver === undefined) {
                        let match = new matches_1.SimpleMatch([refBlk], false);
                        for (let i = slotIdx + 1; i < this.blocks[colIdx].length; i++) {
                            let compareBlk = this.blocks[colIdx][i];
                            if (compareBlk !== undefined && refBlk.hasNormalMatch(compareBlk)) {
                                match.add(compareBlk);
                            }
                            else {
                                break;
                            }
                        }
                        if (match.blocks.length >= 3) {
                            match.blocks.forEach((blk) => {
                                blk.matchInfo = blk.matchInfo ? blk.matchInfo : {};
                                blk.matchInfo.ver = match;
                                if (allMatchBlocks.indexOf(blk) === -1) {
                                    allMatchBlocks.push(blk);
                                }
                            });
                        }
                    }
                }
            }
        }
        /*
        Convert simple matches into compound matches.
        If a simple match intersects with another simple match, attach the other into the compound.
        If the other is also a part of a compound, merge the two compounds.
        */
        allMatchBlocks.forEach((refBlk) => {
            let refMatch = refBlk.matchInfo;
            if (refMatch !== undefined) {
                if (refMatch.compound === undefined) {
                    refMatch.compound = new matches_1.CompoundMatch();
                }
                ['hor', 'ver'].forEach((simp) => {
                    if (refMatch[simp] !== undefined) {
                        let simple = refMatch[simp];
                        refMatch.compound.attachSimpleMatch(simple);
                        simple.blocks.forEach((simpleMember) => {
                            let toAbsorb = simpleMember.matchInfo.compound;
                            if (toAbsorb !== undefined && toAbsorb !== refMatch.compound) {
                                refMatch.compound.absorbCompoundMatch(toAbsorb);
                            }
                            simpleMember.matchInfo.compound = refMatch.compound;
                        });
                    }
                });
            }
        });
        var compounds = [];
        allMatchBlocks.forEach((blk) => {
            var comp = blk.matchInfo.compound;
            if (compounds.indexOf(comp) === -1) {
                compounds.push(comp);
            }
        });
        if (compounds.length > 0) {
            console.log(compounds);
        }
        return compounds;
    }
}
exports.Board = Board;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const YHitbox_1 = __webpack_require__(2);
const BlockType_1 = __webpack_require__(1);
class Block {
    constructor(columnIdx, slotIdx, type, id) {
        this.curVelocity = 60;
        this.selectable = false; // can block be matched with other blocks
        this.contactBelow = false; // is touching a solid directly below
        this.contactBelowPrev = false; // contactBelow for previous frame
        this.columnIdx = columnIdx;
        this.slotIdx = slotIdx;
        this.hitbox = new YHitbox_1.YHitbox(Block.SPAWN_POSITION, Block.HEIGHT);
        this.id = id;
        this.type = type;
    }
    // step(): void {
    // 	this.hitbox.move(this.curVelocity);
    // }
    setColor(blockColor) {
        this.color = blockColor;
        return this;
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
    activateSelectable() {
        this.selectable = true;
        return this;
    }
    setType(type) {
        // clear matches
        this.matchInfo = undefined;
        switch (type) {
            case BlockType_1.BlockType.NORMAL:
                break;
            case BlockType_1.BlockType.GARBAGE:
            case BlockType_1.BlockType.ROCKET:
                this.color = undefined;
                break;
        }
        return this;
    }
    hasNormalMatch(other) {
        if (this.type === BlockType_1.BlockType.NORMAL && other.type === BlockType_1.BlockType.NORMAL
            && this.color === other.color) {
            return true;
        }
        return false;
    }
}
Block.HEIGHT = 100;
Block.SPAWN_POSITION = -100;
exports.Block = Block;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Rectangle {
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
exports.Rectangle = Rectangle;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function randInt(from, to, inclusive) {
    var range = to - from;
    var tmp = Math.floor(Math.random() * (range + (inclusive ? 1 : 0)));
    return from + tmp;
}
exports.randInt = randInt;
function rand(from, to) {
    // to-exclusive
    var range = to - from;
    var tmp = Math.random() * range;
    return from + tmp;
}
exports.rand = rand;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.Timer = Timer;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* A match consisting of one straight line */
class SimpleMatch {
    constructor(blocks, isHorizontal) {
        this.blocks = [];
        this.blocks = blocks;
        this.isHorizontal = isHorizontal;
    }
    add(block) {
        this.blocks.push(block);
    }
}
exports.SimpleMatch = SimpleMatch;
/* One or more matches that connect/intersect */
class CompoundMatch {
    constructor() {
        this.simpleMatches = [];
        this.blocks = [];
    }
    attachSimpleMatch(simpleMatch) {
        if (this.simpleMatches.indexOf(simpleMatch) === -1) {
            this.simpleMatches.push(simpleMatch);
            simpleMatch.blocks.forEach((blk) => {
                if (this.blocks.indexOf(blk) === -1) {
                    this.blocks.push(blk);
                }
            });
        }
    }
    absorbCompoundMatch(match) {
        match.simpleMatches.forEach((sm) => {
            this.attachSimpleMatch(sm);
        });
    }
}
exports.CompoundMatch = CompoundMatch;
/*
some match scenarios...
F = blocks falling into place

Faa
Faa
a

aFa
 a
 a
    
aFF
 aa
 aa
    
aaF
aaF
  a

*/ 


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BlockColor_1 = __webpack_require__(0);
class Planet {
    constructor(data) {
        this.distribArr = [];
        this.colors = [];
        this.numColumns = data.columns;
        this.physics = data.physics;
        this.inputDistrib = data.colors;
        this.distribSum = 0;
        Object.keys(this.inputDistrib).forEach((colorStr) => {
            this.colors.push(BlockColor_1.BlockColorUtil.strToColor(colorStr));
            this.distribArr.push({
                color: BlockColor_1.BlockColorUtil.strToColor(colorStr),
                colorStr: colorStr,
                weight: this.inputDistrib[colorStr],
            });
            this.distribSum += this.inputDistrib[colorStr];
        });
    }
}
exports.Planet = Planet;


/***/ })
/******/ ]);
//# sourceMappingURL=client.bundle.js.map