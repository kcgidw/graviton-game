import {YHitbox} from './YHitbox';
import {BlockColor} from './BlockTypes';
import {BoardColumn} from './Board';

// movement
export class Block {
	hitbox: YHitbox;
	curVelocity: number = -1;

	color: BlockColor;

	matchable: boolean = false;	// can block be matched with other blocks

	constructor() {
		this.hitbox = new YHitbox(100, 10);
		this.color = BlockColor.RED;
    }
    
    step(): void {
        this.hitbox.move(this.curVelocity);
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