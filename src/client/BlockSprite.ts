import { Block } from "../game-core/Block";
import { Board } from "../game-core/Board";
import { PointerState } from "./ClientFacade";

export class BlockSprite {
	block: Block;
	sprite: PIXI.Sprite;
	board: Board;
	debugId: PIXI.Text;

	constructor(board: Board, block: Block, sprite: PIXI.Sprite) {
		this.board = board;
		this.block = block;
		this.sprite = sprite;

		this.sprite.x = this.block.columnIdx * this.sprite.width;
		this.sprite.interactive = true;
		this.sprite.on('pointerdown', () => {
			this.board.facade.selectBlock(this);
		});

		// debug text
		this.debugId = new PIXI.Text(block.id + '', {fill: '#ffffff'});
		var colText = new PIXI.Text('col '+block.columnIdx, {fill: '#ffffff'});
		this.debugId.addChild(colText);
		colText.y += 20;
		var slotText = new PIXI.Text('stk '+block.slotIdx, {fill: '#ffffff'});
		this.debugId.addChild(slotText);
		slotText.y += 40;

		// (<any>this.sprite).__BLOCK = block;
	}
	updateSpritePosition(y: number) {
		this.sprite.y = y;
		this.sprite.addChild(this.debugId);
	}
	destroy() {
		this.sprite.destroy();
	}
}
