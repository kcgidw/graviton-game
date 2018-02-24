import {YHitbox} from './YHitbox';
import {BlockColor} from './BlockTypes';

// movement
export class Block {
	columnIdx: number;
	blockIdx: number;
	id: number;

	hitbox: YHitbox;
	curVelocity: number = 2;

	color: BlockColor;

	matchable: boolean = false;	// can block be matched with other blocks

	constructor(columnIdx, blockIdx) {
		this.columnIdx = columnIdx;
		this.blockIdx = blockIdx;
		this.hitbox = new YHitbox(100, 10);
		this.color = BlockColor.RED;
	}

	// step(): void {
	// 	this.hitbox.move(this.curVelocity);
	// }

	setColor(blockColor: BlockColor) {
		this.color = blockColor;
	}

	isRising(): boolean {
		return this.curVelocity > 0;
	}
	isFalling(): boolean {
		return this.curVelocity < 0;
	}
	isStationary(): boolean {
		return this.curVelocity === 0;
	}
}
