import {Board} from '../game-core/Board';
import {Block} from '../game-core/Block';
import {Box2d} from '../game-core/Box2d';
import {BlockColor, colorToFilename} from '../game-core/BlockTypes';

export class ClientFacade {
	board: Board;
	app: PIXI.Application;
	boardContainer: PIXI.Container;
	blocksContainer: PIXI.Container;
	backdropContainer: PIXI.Container;

	blockSprites: BlockSpriteRegistry;

	constructor(board: Board, app: PIXI.Application) {
		this.board = board;
		this.app = app;
		this.blockSprites = new BlockSpriteRegistry(this);

		this.boardContainer = this.app.stage.addChild(new PIXI.Container());
		this.backdropContainer = this.boardContainer.addChild(new PIXI.Container());
		this.blocksContainer = this.boardContainer.addChild(new PIXI.Container());

		let targetBoardWidthRatio = 0.9;

		let tileWidth = PIXI.loader.resources[colorToFilename(BlockColor.RED)].texture.width * this.app.stage.scale.x;
		let baseBoardWidth = tileWidth * this.board.numColumns;
		let targetBoardWidth = this.app.renderer.width * targetBoardWidthRatio;
		let scale = targetBoardWidth / baseBoardWidth;
		this.blocksContainer.scale = new PIXI.Point(scale, scale);

		let logicW = this.board.dimensions.width;
		let logicH = this.board.dimensions.height;
		// targetBoardWidth = logicW * targetBoardWidthRatio;
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

	draw(): void {
		this.board.blocks.forEach((column) => {
			column.forEach((block) => {
				let bs: BlockSprite = this.blockSprites.get(block);
				if(!bs) {
					bs = this.addBlock(block);
				}
				bs.updateSpritePosition(block.hitbox.top);
			});
		});
	}

	addBlock(block: Block): BlockSprite {
		// blocksprite's sprite width will start as 0 if texture is loaded on demand,
		// causing draw mistakes. Make sure your stuff is pre-loaded
		let spr: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[colorToFilename(block.color)].texture);
		// TODO preload texture http://www.html5gamedevs.com/topic/16019-preload-all-textures/
		this.blocksContainer.addChild(spr);
		let bs: BlockSprite = this.blockSprites.register(block, spr);
		return bs;
	}
	removeBlock(block: Block): void {
		let bs: BlockSprite = this.blockSprites.deregister(block);
		bs.destroy();      // TODO hide and reuse
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

class BlockSprite {
	block: Block;
	sprite: PIXI.Sprite;
	board: Board;
	debugId: PIXI.Text;

	constructor(board: Board, block: Block, sprite: PIXI.Sprite) {
		this.board = board;
		this.block = block;
		this.sprite = sprite;
		this.sprite.x = this.block.columnIdx * this.sprite.width;
		this.debugId = new PIXI.Text(block.id+' '+block.columnIdx, {fill: '#ffffff'});
	}
	updateSpritePosition(y: number) {
		this.sprite.y = y;
		this.sprite.addChild(this.debugId);
	}
	destroy() {
		this.sprite.destroy();
	}
}
