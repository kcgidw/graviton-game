import {Board} from '../game-core/Board';
import {Block} from '../game-core/block/Block';
import {Rectangle} from '../game-core/Rectangle';
import {BlockColor, BlockColorUtil} from '../game-core/block/BlockColor';
import { BlockSprite } from './BlockSprite';
import { interaction } from 'pixi.js';

const targetBoardWidthRatio = 0.95;		// ratio of board width to canvas width

export enum PointerState { DOWN, UP }

export class ClientFacade {
	board: Board;
	app: PIXI.Application;
	boardContainer: PIXI.Container;
	blocksContainer: PIXI.Container;
	backdropContainer: PIXI.Container;

	blockSprites: BlockSpriteRegistry;

	pointerState: PointerState;

	selectedBlock: BlockSprite;

	constructor(board: Board, app: PIXI.Application) {
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
		this.app.stage.on('pointerdown', (eventData) => {});
		this.app.stage.on('pointermove', (eventData) => {
			if(this.selectedBlock !== undefined) {
				var pointerCoordinates: PIXI.Point = eventData.data.getLocalPosition(this.boardContainer);
				var pointerY: number = pointerCoordinates.y;
				let swappedWith: Block;
				if(pointerY < this.selectedBlock.block.physics.topY) {
					swappedWith = this.board.swapUp(this.selectedBlock.block);
				} else if(pointerY > this.selectedBlock.block.physics.getBottom()) {
					swappedWith = this.board.swapDown(this.selectedBlock.block);
				}
				if(swappedWith) {
					this.selectedBlock = this.blockSprites.get(swappedWith);
				}
			}
		});
	}

	resizeBoard(): void {
		var canvasW = this.app.renderer.view.width;
		var canvasH = this.app.renderer.view.height;
		var logicW = this.board.dimensions.width;
		var logicH = this.board.dimensions.height;
		var scale = (canvasW * targetBoardWidthRatio) / logicW;
		this.boardContainer.scale = new PIXI.Point(scale, scale);
		// console.log('SCALE '+scale);
		// console.log(this.boardContainer.scale.x + ' ' + this.app.stage.scale.x);

		// reposition board
		var leftMargin = (canvasW - this.boardContainer.width) / 2;
		var topMargin = (canvasH - this.boardContainer.height) / 2;
		this.boardContainer.x = leftMargin;
		this.boardContainer.y = topMargin;
	}

	step(): void {
		this.draw();
	}

	draw(): void {
		for(let col of this.board.blocks) {
			for(let blk of col) {
				let bs: BlockSprite = this.blockSprites.get(blk);
				if(!bs) {
					bs = this.addBlock(blk);
				}
				bs.updateSpritePosition(blk.physics.topY);
				bs.updateTexture();
			}
		}
	}

	addBlock(block: Block): BlockSprite {
		// blocksprite's sprite width will start as 0 if texture is loaded on demand,
		// causing draw mistakes. Make sure your stuff is pre-loaded
		let spr: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[BlockColorUtil.colorToFilename(block.substance.color)].texture);
		// TODO preload texture http://www.html5gamedevs.com/topic/16019-preload-all-textures/
		this.blocksContainer.addChild(spr);
		let bs: BlockSprite = this.blockSprites.register(block, spr);
		return bs;
	}
	removeBlock(block: Block): void {
		let bs: BlockSprite = this.blockSprites.deregister(block);
		bs.destroy();      // TODO hide and reuse
	}

	selectBlock(bs: BlockSprite): void {
		this.selectedBlock = bs;
		if(bs) console.log('selected ' + this.selectedBlock.block.id);
		// console.log(bs ? 'selected ' + this.selectedBlock.block.id : ' deselect');
	}
}

class BlockSpriteRegistry {
	map: any = {};
	facade: ClientFacade;

	constructor(facade: ClientFacade) {
		this.facade = facade;
	}

	get(block: Block) {
		return this.map[block.id];
	}

	register(block: Block, sprite: PIXI.Sprite): BlockSprite {
		let bs = new BlockSprite(this.facade.board, block, sprite);
		this.map[block.id] = bs;
		return bs;
	}
	deregister(block: Block): BlockSprite {
		let bs: BlockSprite = this.get(block);
		delete this.map[block.id];
		return bs;
	}
}
