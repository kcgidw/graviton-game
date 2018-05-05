import {BlockColor} from './BlockColor';
import { SimpleMatch, CompoundMatch } from '../matches';
import { BlockType } from './BlockType';
import { Timer } from '../Timer';
import { BlockPhysics } from './BlockPhysics';
import { SlotCluster } from '../SlotCluster';
import { Board } from '../Board';
import { Planet } from '../Planet';
import { BlockSubstance } from './BlockSubstance';

export class Block {
	static HEIGHT: number = 100;
	static SPAWN_POSITION: number = -100;

	id: number;

	columnIdx: number;
	slotIdx: number;

	substance: BlockSubstance;
	physics: BlockPhysics;

	selectable: boolean = false;	// can block be matched with other blocks

	matchInfo: IMatchInfo;

	constructor(planet: Planet, columnIdx: number, slotIdx: number, type: BlockType, id: number, iv: number) {
		this.columnIdx = columnIdx;
		this.slotIdx = slotIdx;
		this.substance = new BlockSubstance(type);
		this.physics = new BlockPhysics(this, planet, Block.SPAWN_POSITION, Block.HEIGHT, iv);
		this.id = id;
	}

	activateSelectable(): Block {
		this.selectable = true;
		return this;
	}

	setColor(blockColor: BlockColor): Block {
		this.substance.setColor(blockColor);
		return this;
	}
	
	setType(type: BlockType): Block {
		this.substance.setType(type);
		this.matchInfo = undefined;	// clear matches
		return this;
	}

	hasNormalMatch(other: Block): boolean {
		if(this.substance.type === BlockType.NORMAL && this.substance.matches(other.substance)) { 
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

	isBaseBlock(): boolean {
		if(this.physics.cluster) {
			return this.physics.cluster.getBottomBlocks().indexOf(this) !== -1;
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