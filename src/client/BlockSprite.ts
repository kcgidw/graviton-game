import { Block } from "../game-core/block/Block";
import { Board } from "../game-core/Board";
import { PointerState } from "./ClientFacade";
import { BlockType } from "../game-core/block/BlockType";
import { BlockColorUtil } from "../game-core/block/BlockColor";

export class BlockSprite {
	block: Block;
	sprite: PIXI.Sprite;
	board: Board;
	text: PIXI.Text;

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
		this.updateDebugText();
		// (<any>this.sprite).__BLOCK = block;
	}
	updateDebugText() {
		if(!this.text) this.text = new PIXI.Text('', {fill: '#ffffff', lineHeight: 16});
		this.text.text = `${this.block.id}\n
		c${this.block.columnIdx}.s${this.block.slotIdx}\n
		${this.block.physics.cluster === undefined ? 'u' : this.block.physics.cluster.id}`;
	}
	updateSpritePosition(y: number) {
		this.sprite.y = y;
		this.sprite.addChild(this.text);
		this.updateDebugText();
	}
	updateTexture() {
		var type: BlockType = this.block.substance.type;
		switch(type) {
			case BlockType.NORMAL:
				this.sprite.texture = BlockColorUtil.colorToTexture(this.block.substance.color);
				break;
			case BlockType.ROCKET:
			case BlockType.GARBAGE:
				this.sprite.texture = BlockColorUtil.typeToTexture(BlockType.ROCKET);
				break;
		}
	}
	destroy() {
		this.sprite.destroy();
	}
}
