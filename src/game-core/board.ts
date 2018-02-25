import {Block} from './Block';
import {BlockColor} from './BlockTypes';
import {ClientFacade} from '../client/ClientFacade';
import {Box2d} from './Box2d';

/* TODO
- Load a cache of block objects?
*/

export class Board {
	dimensions: Box2d = new Box2d(0,0,1280,720);
	numRows: number = 12;
	numColumns: number = 9;
	colors: BlockColor[] = [];
	physics: IPlanetPhysics;
	blocks: Block[][] = [];

	facade: ClientFacade;

	constructor(facade?: ClientFacade) {
		for(let i=0; i<this.numColumns; i++) {
			this.blocks.push([]);
		}
		this.facade = facade;

		this.spawnBlock(0, 'blah');
	}

	forEachBlock(fn: (block: Block)=>any) {
		this.blocks.forEach((col) => {
			col.forEach((block) => {
				fn(block);
			});
		});
	}

	step() {
		this.forEachBlock((block) => {
			block.hitbox.top = block.hitbox.top + block.curVelocity;
			if(block.hitbox.getBottom() > this.dimensions.getBottom()) {
				block.hitbox.setBottom(this.dimensions.getBottom());
			}
		});
	}

	spawnBlockAtRandom(): void {
		var colNum: number = Math.floor(Math.random() * this.numColumns);
	}

	spawnBlock(colIdx: number, color: string): void {
		var col: Block[] = this.blocks[colIdx];
		var blockIdx = col.length;
		var block: Block = new Block(colIdx, blockIdx);
		col.push(block);
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
