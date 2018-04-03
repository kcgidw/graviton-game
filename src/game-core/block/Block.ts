import {BlockColor} from './BlockColor';
import { SimpleMatch, CompoundMatch } from '../matches';
import { BlockType } from './BlockType';
import { Timer } from '../Timer';
import { BlockPhysics } from './BlockPhysics';
import { SlotCluster } from '../SlotCluster';
import { Board } from '../Board';
import { Planet } from '../Planet';

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

	constructor(planet: Planet, columnIdx: number, slotIdx: number, type: BlockType, id: number, iv: number) {
		this.columnIdx = columnIdx;
		this.slotIdx = slotIdx;
		this.physics = new BlockPhysics(planet, Block.SPAWN_POSITION, Block.HEIGHT, iv);
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
		// console.log('block ' + this.id + ' was color ' + this.color);
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
			// same cluster
			if(this.physics.cluster === other.physics.cluster) {
				return true;
			}
			// account for chain-jumping
			if(this.physics.forces.gravity === 0 && other.physics.forces.gravity === 0) {
				return true;
			}
		}
		return false;
	}

	get y(): number {
		return this.physics.topY;
	}
	get bottom() {
		return this.physics.getBottom();
	}
	get cluster(): SlotCluster {
		return this.physics.cluster;
	}
}
export interface IMatchInfo {
	hor?: SimpleMatch;
	ver?: SimpleMatch;
	compound?: CompoundMatch;
}