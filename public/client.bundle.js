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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = __webpack_require__(2); // TODO webpack to es5
const ClientFacade_1 = __webpack_require__(6);
var board = new Board_1.Board();
var logicWidth = board.dimensions.width;
var logicHeight = board.dimensions.height;
let container = document.getElementById('game-container');
let app = new PIXI.Application({ width: logicWidth, height: logicHeight });
// app.renderer.autoResize = true;
// scale the pixi app and its stage
let scale = 0.4;
app.renderer.resize(logicWidth * scale, logicHeight * scale);
app.stage.scale = new PIXI.Point(scale, scale);
container.appendChild(app.view).setAttribute('id', 'gameApp');
var facade = new ClientFacade_1.ClientFacade(board, app);
function mainLoop(stamp) {
    board.step();
    facade.draw();
    requestAnimationFrame(mainLoop);
}
mainLoop();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = __webpack_require__(3);
const Box2d_1 = __webpack_require__(0);
/* TODO
- Load a cache of block objects?
*/
class Board {
    constructor(facade) {
        this.dimensions = new Box2d_1.Box2d(0, 0, 1280, 720);
        this.numRows = 12;
        this.numColumns = 9;
        this.colors = [];
        this.blocks = [];
        for (let i = 0; i < this.numColumns; i++) {
            this.blocks.push([]);
        }
        this.facade = facade;
        this.spawnBlock(0, 'blah');
    }
    forEachBlock(fn) {
        this.blocks.forEach((col) => {
            col.forEach((block) => {
                fn(block);
            });
        });
    }
    step() {
        this.forEachBlock((block) => {
            block.hitbox.top = block.hitbox.top + block.curVelocity;
            if (block.hitbox.getBottom() > this.dimensions.getBottom()) {
                block.hitbox.setBottom(this.dimensions.getBottom());
            }
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const YHitbox_1 = __webpack_require__(4);
const BlockTypes_1 = __webpack_require__(5);
// movement
class Block {
    constructor(columnIdx, blockIdx) {
        this.curVelocity = 20;
        this.matchable = false; // can block be matched with other blocks
        this.columnIdx = columnIdx;
        this.blockIdx = blockIdx;
        this.hitbox = new YHitbox_1.YHitbox(0, 100);
        this.color = BlockTypes_1.BlockColor.RED;
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
/* 4 */
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
        if (this.getBottom() <= other.top) {
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
}
exports.YHitbox = YHitbox;


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ClientFacade {
    constructor(board, app) {
        this.board = board;
        this.app = app;
        this.blockSprites = new BlockSpriteRegistry(this);
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
        console.log(this.board.blocks[0][0].hitbox.top);
    }
    addBlock(block) {
        let spr = PIXI.Sprite.fromImage('assets/images/red.png');
        // TODO preload texture http://www.html5gamedevs.com/topic/16019-preload-all-textures/
        this.app.stage.addChild(spr);
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
        let bs = new BlockSprite(this.facade.board.dimensions, block, sprite);
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
    constructor(boardDimensions, block, sprite) {
        this.boardDimensions = boardDimensions;
        this.block = block;
        this.sprite = sprite;
    }
    updateSpritePosition(y) {
        this.sprite.y = y;
    }
    destroy() {
        this.sprite.destroy();
    }
}


/***/ })
/******/ ]);
//# sourceMappingURL=client.bundle.js.map