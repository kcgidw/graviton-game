import {Board} from '../game-core/Board';
import {Block} from '../game-core/Block';
import {Box2d} from '../game-core/Box2d';

export class ClientFacade {
	board: Board;
	app: PIXI.Application;

	blockSprites: BlockSpriteRegistry;

	dimensions: Box2d;

	constructor(board: Board, app: PIXI.Application) {
		this.board = board;
		this.app = app;
		this.blockSprites = new BlockSpriteRegistry(this);
		this.dimensions = new Box2d(10, 10, 640, 360);
	}

	draw(): void {
		this.board.blocks.forEach((column) => {
			column.forEach((block) => {
				let bs: BlockSprite = this.blockSprites.get(block);
				if(!bs) {
					bs = this.addBlock(block);
				}
				bs.updateSpritePosition();
			});
		});
		console.log(this.board.blocks[0][0].hitbox.top);
	}
	addBlock(block: Block): BlockSprite {
		let spr: PIXI.Sprite = PIXI.Sprite.fromImage('assets/images/red.png');
		// TODO preload texture http://www.html5gamedevs.com/topic/16019-preload-all-textures/
		this.app.stage.addChild(spr);
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
		let bs = new BlockSprite(this.facade.dimensions, block, sprite);
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
	boardDimensions: Box2d;

	constructor(boardDimensions: Box2d, block: Block, sprite: PIXI.Sprite) {
		this.boardDimensions = boardDimensions;
		this.block = block;
		this.sprite = sprite;
	}
	updateSpritePosition() {
		this.sprite.y = this.block.hitbox.top;
	}
	destroy() {
		this.sprite.destroy();
	}
}
