import {YHitbox} from './YHitbox';
import {BlockColor} from './BlockColor';

// movement
export class Block {
	columnIdx: number;
	blockIdx: number;
	id: number;

	hitbox: YHitbox;
	curVelocity: number = 30;

	color: BlockColor;

	matchable: boolean = false;	// can block be matched with other blocks

	constructor(columnIdx: number, blockIdx: number, color: BlockColor, id: number) {
		this.columnIdx = columnIdx;
		this.blockIdx = blockIdx;
		this.hitbox = new YHitbox(0, 100);
		this.color = color;
		this.id = id;
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

	// getSittingOn(): Block {}
	// getSittingAbove(): Block {}
}
