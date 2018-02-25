import {Block} from './Block';
import {BlockColor} from './BlockTypes';
import {ClientFacade} from '../client/ClientFacade';
import {Box2d} from './Box2d';
import { YHitbox } from './YHitbox';

/* TODO
- Load a cache of block objects?
*/

export class Board {
	dimensions: Box2d = new Box2d(0,0,1280,720);
	numRows: number = 12;
	numColumns: number = 4; // 9;
	colors: BlockColor[] = [];
	physics: IPlanetPhysics;

	ground: YHitbox;
	blocks: Block[][] = [];

	facade: ClientFacade;

	blockId: number = 0;

	constructor(facade?: ClientFacade) {
		for(let i=0; i<this.numColumns; i++) {
			this.blocks.push([]);
		}
		this.facade = facade;

		this.ground = new YHitbox(this.dimensions.getBottom(), 100);

		this.spawnerProcess();
	}

	forEachBlock(fn: (block: Block, idx: number)=>any) {
		this.blocks.forEach((col) => {
			col.forEach((block, idx) => {
				fn(block, idx);
			});
		});
	}

	step() {
		this.forEachBlock((block, idx) => {
			block.hitbox.top = block.hitbox.top + block.curVelocity;

			if(idx === 0 && block.hitbox.collidesBelow(this.ground)) {
				block.hitbox.moveToContact(this.ground);
			} else {
				let nextBlock: Block = this.blocks[block.columnIdx][idx - 1];
				if(nextBlock && block.hitbox.collidesBelow(nextBlock.hitbox)) {
					block.hitbox.moveToContact(nextBlock.hitbox);
				}
			}
		});
	}

	// Returns the next block under this one, even if they aren't in contact
	getNextBlockBelow(block: Block): Block {
		let colIdx = block.columnIdx;
		let blockIdx = block.blockIdx;
		if(blockIdx === 0) {
			return null;
		}
		return this.blocks[colIdx][blockIdx - 1];
	}

	getRandomColumnIdx(): number {
		let idx =  Math.floor(Math.random() * this.numColumns);
		return idx;
	}
	spawnBlock(colIdx: number, color: BlockColor): void {
		var col: Block[] = this.blocks[colIdx];
		var blockIdx = col.length;
		var block: Block = new Block(colIdx, blockIdx, this.blockId++);
		col.push(block);
		console.log(this);
	}
	spawnerProcess(): void {
		this.spawnBlock(this.getRandomColumnIdx(), BlockColor.RED);
		setTimeout(() => {
			this.spawnerProcess();
		}, 0.5* 1000);
	}
}

interface IPlanetPhysics {
	fallIV: number;
	fallROC: number;

	launchIV: number;		// initial velocity (rising)
	launchROC1: number;		// launch acceleration
	launchROC1Dur: number;	// duration of launchROC1
	launchROC2: number;		// deceleration after ROC1
	launchFinal: number;		// final velocity (falling)

	descentV: number;		// rocket descent velocity. no ROC
}
