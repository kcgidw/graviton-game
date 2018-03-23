import {BlockColor} from './BlockColor';
import { SimpleMatch, CompoundMatch } from '../matches';
import { BlockType } from './BlockType';
import { Timer } from '../Timer';
import { BlockPhysics } from './BlockPhysics';

export class Block {
	static HEIGHT: number = 100;
	static SPAWN_POSITION: number = -100;

	id: number;

	columnIdx: number;
	slotIdx: number;

	type: BlockType;
	color: BlockColor;

	physics: BlockPhysics;

	selectable: boolean = false;	// can block be matched with other blocks

	matchInfo: IMatchInfo;

	constructor(columnIdx: number, slotIdx: number, type: BlockType, id: number, iv: number) {
		this.columnIdx = columnIdx;
		this.slotIdx = slotIdx;
		this.physics = new BlockPhysics(Block.SPAWN_POSITION, Block.HEIGHT, iv);
		this.id = id;
		this.type = type;
	}

	activateSelectable(): Block {
		this.selectable = true;
		return this;
	}

	setColor(blockColor: BlockColor): Block {
		this.color = blockColor;
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
}
export interface IMatchInfo {
	hor?: SimpleMatch;
	ver?: SimpleMatch;
	compound?: CompoundMatch;
}