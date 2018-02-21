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
let app = new PIXI.Application({ width: 100, height: 800 });
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
    constructor() {
        this.numColumns = 7;
        this.colors = [];
        this.columns = [];
        for (let i = 0; i < this.numColumns; i++) {
            this.columns.push(new BoardColumn());
        }
        this.spawnBlock(0, 'blah');
    }
    step() {
        this.columns.forEach((col) => {
            col.step();
        });
    }
    getColumn(col) {
        if (col < 0 || col > this.numColumns) {
            throw 'Bad column #: ' + col;
        }
        return this.columns[col];
    }
    spawnBlockAtRandom() {
        var colNum = Math.floor(Math.random() * this.numColumns);
    }
    spawnBlock(colIdx, color) {
        var col = this.getColumn(colIdx);
        col.spawnBlock(color);
    }
}
exports.Board = Board;
class BoardColumn {
    constructor() {
        this.blocks = [];
    }
    step() {
        this.blocks.forEach((block) => {
            block.step();
        });
    }
    spawnBlock(color) {
        this.blocks.push(new Block_1.Block());
    }
}
exports.BoardColumn = BoardColumn;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const YHitbox_1 = __webpack_require__(3);
const BlockTypes_1 = __webpack_require__(4);
// movement
class Block {
    constructor() {
        this.curVelocity = -1;
        this.matchable = false; // can block be matched with other blocks
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
        this.board = board;
        this.app = app;
    }
    draw() {
        console.log(this.board);
    }
}
exports.BoardView = BoardView;


/***/ })
/******/ ]);