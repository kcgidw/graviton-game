import {Block} from './Block';
import {BlockColor} from './BlockTypes';
import {BoardView} from '../client/BoardView';

export class Board {
	numRows: number = 12;
	numColumns: number = 9;
	colors: BlockColor[] = [];
	physics: IPlanetPhysics;
	blocks: Block[][] = [];

	view: BoardView;

	constructor(boardView?: BoardView) {
		for(let i=0; i<this.numColumns; i++) {
			this.blocks[i] = [];
		}
		this.view = boardView;

		this.spawnBlock(0, 'blah');
	}

	step() {
		this.blocks.forEach((col) => {
			col.forEach((block) => {
				block.step();
			});
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
