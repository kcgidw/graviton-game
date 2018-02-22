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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = __webpack_require__(1); // TODO webpack to es5
const BoardView_1 = __webpack_require__(5);
let container = document.getElementById('game-container');
let app = new PIXI.Application({ width: 360, height: 640 });
container.appendChild(app.view);
var board = new Board_1.Board();
console.log(board);
var boardView = new BoardView_1.BoardView(board, app);
function mainLoop(stamp) {
    board.step();
    boardView.draw();
    requestAnimationFrame(mainLoop);
}
mainLoop();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = __webpack_require__(2);
class Board {
    constructor(boardView) {
        this.numColumns = 7;
        this.colors = [];
        this.blocks = [];
        for (let i = 0; i < this.numColumns; i++) {
            this.blocks[i] = [];
        }
        this.view = boardView;
        this.spawnBlock(0, 'blah');
    }
    step() {
        this.blocks.forEach((col) => {
            col.forEach((block) => {
                block.step();
            });
        });
    }
    spawnBlockAtRandom() {
        var colNum = Math.floor(Math.random() * this.numColumns);
    }
    spawnBlock(colIdx, color) {
        var col = this.blocks[colIdx];
        var blockIdx = col.length;
        var block = new Block_1.Block(colIdx, blockIdx);
        col.push(block);
    }
}
exports.Board = Board;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const YHitbox_1 = __webpack_require__(3);
const BlockTypes_1 = __webpack_require__(4);
// movement
class Block {
    constructor(columnIdx, blockIdx) {
        this.curVelocity = -1;
        this.matchable = false; // can block be matched with other blocks
        this.columnIdx = columnIdx;
        this.blockIdx = blockIdx;
        this.hitbox = new YHitbox_1.YHitbox(100, 10);
        this.color = BlockTypes_1.BlockColor.RED;
    }
    step() {
        this.hitbox.move(this.curVelocity);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// position and collision
class YHitbox {
    constructor(y, height) {
        this.y = y;
    }
    top() {
        return this.y + this.height;
    }
    collidesBelow(other) {
        if (this.y <= other.top()) {
            return true;
        }
        // does NOT check if this is completely under 'other'
        return false;
    }
    move(dist) {
        this.y += dist;
    }
}
exports.YHitbox = YHitbox;


/***/ }),
/* 4 */
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
var BlockType;
(function (BlockType) {
    BlockType[BlockType["NORMAL"] = 0] = "NORMAL";
    BlockType[BlockType["ROCKET"] = 1] = "ROCKET";
    BlockType[BlockType["GARBAGE"] = 2] = "GARBAGE";
})(BlockType || (BlockType = {}));
exports.BlockType = BlockType;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BoardView {
    constructor(board, app) {
        this.blockSprites = new BlockSpriteRegistry();
        // dimensions
        this.bottom = 640 - 20;
        this.top = 50;
        this.left = 20;
        this.right = 360 - 20;
        this.board = board;
        this.app = app;
    }
    draw() {
        this.board.blocks.forEach((column) => {
            column.forEach((block) => {
                let existing = this.blockSprites.get(block);
                if (existing) {
                    existing.draw();
                }
                else {
                    this.addBlock(block);
                }
            });
        });
        console.log(this.board.blocks[0][0].hitbox.y);
    }
    addBlock(block) {
        var spr = PIXI.Sprite.fromImage('assets/images/red.png');
        // TODO preload texture http://www.html5gamedevs.com/topic/16019-preload-all-textures/
        this.app.stage.addChild(spr);
        var bs = new BlockSprite(this, block, spr);
        this.blockSprites.register(block, bs);
    }
    removeBlock(block) {
        var bs = this.blockSprites.deregister(block);
        bs.destroy(); // TODO hide and reuse
    }
}
exports.BoardView = BoardView;
class BlockSpriteRegistry {
    constructor() {
        this.map = {};
    }
    get(block) {
        return this.map[block.id];
    }
    register(block, blockSprite) {
        this.map[block.id] = blockSprite;
    }
    deregister(block) {
        var bs = this.get(block);
        delete this.map[block.id];
        return bs;
    }
}
class BlockSprite {
    constructor(view, block, sprite) {
        this.view = view;
        this.block = block;
        this.sprite = sprite;
    }
    draw() {
        this.sprite.y = this.block.hitbox.y;
    }
    destroy() {
        this.sprite.destroy();
    }
}


/***/ })
/******/ ]);