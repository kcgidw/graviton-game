import {YHitbox} from './YHitbox';
import {BlockColor} from './BlockColor';

export class Block {
	static HEIGHT: number = 100;
	static SPAWN_POSITION: number = -100;

	columnIdx: number;
	slotIdx: number;
	id: number;

	hitbox: YHitbox;
	curVelocity: number = 60;

	color: BlockColor;

	selectable: boolean = false;	// can block be matched with other blocks

	contactBelow: boolean = false;
	contactBelowPrev: boolean = false;

	constructor(columnIdx: number, slotIdx: number, color: BlockColor, id: number) {
		this.columnIdx = columnIdx;
		this.slotIdx = slotIdx;
		this.hitbox = new YHitbox(Block.SPAWN_POSITION, Block.HEIGHT);
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

	activateSelectable(): void {
		this.selectable = true;
	}

	// getSittingOn(): Block {}
	// getSittingAbove(): Block {}
}
