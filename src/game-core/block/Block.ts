import {YHitbox} from './YHitbox';
import {BlockColor} from './BlockColor';
import { SimpleMatch, CompoundMatch } from '../matches';
import { BlockType } from './BlockType';
import { Timer } from '../Timer';

export class Block {
	static HEIGHT: number = 100;
	static SPAWN_POSITION: number = -100;

	columnIdx: number;
	slotIdx: number;
	id: number;

	type: BlockType;

	hitbox: YHitbox;
	velocity: number = 20;

	color: BlockColor;

	selectable: boolean = false;	// can block be matched with other blocks

	contactBelow: boolean = false;	// is touching a solid directly below
	contactBelowPrev: boolean = false;	// contactBelow for previous frame

	matchInfo: IMatchInfo;

	forces: IForceInfo = {
		gravity: 0,
		thrust: 0,
		thrustTimer: undefined,
	};

	constructor(columnIdx: number, slotIdx: number, type: BlockType, id: number) {
		this.columnIdx = columnIdx;
		this.slotIdx = slotIdx;
		this.hitbox = new YHitbox(Block.SPAWN_POSITION, Block.HEIGHT);
		this.id = id;
		this.type = type;
	}

	// step(): void {
	// 	this.hitbox.move(this.velocity);
	// }

	setColor(blockColor: BlockColor): Block {
		this.color = blockColor;
		return this;
	}

	isRising(): boolean {
		return this.velocity > 0;
	}
	isFalling(): boolean {
		return this.velocity < 0;
	}
	isStationary(): boolean {
		return this.velocity === 0;
	}

	activateSelectable(): Block {
		this.selectable = true;
		return this;
	}

	setType(type: BlockType): Block {
		this.type = type;

		// clear matches
		this.matchInfo = undefined;
		
		switch(type) {
			case BlockType.NORMAL:
				break;
			case BlockType.GARBAGE:
			case BlockType.ROCKET:
				this.color = undefined;
				break;
		}
		return this;
	}

	hasNormalMatch(other: Block): boolean {
		if(this.type === BlockType.NORMAL && other.type === BlockType.NORMAL
		&& this.color === other.color) {
			return true;
		}
		return false;
	}

	// getSittingOn(): Block {}
	// getSittingAbove(): Block {}
}
export interface IMatchInfo {
	hor?: SimpleMatch;
	ver?: SimpleMatch;
	compound?: CompoundMatch;
}

export interface IForceInfo {
	gravity: number;
	thrust: number;
	thrustTimer: Timer;
}