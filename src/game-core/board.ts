import {Block} from './Block';
import {BlockColor} from './BlockTypes';

export class Board {
	numColumns: number = 7;
	colors: BlockColor[] = [];
	physics: PlanetPhysics;
	columns: BoardColumn[] = [];

	constructor() {
		for(let i=0; i<this.numColumns; i++) {
			this.columns.push(new BoardColumn());
		}
		this.spawnBlock(0, 'blah');
	}

	step() {
		this.columns.forEach((col) => {
			col.step();
		});
	}

	getColumn(col: number): BoardColumn {
		if(col < 0 || col > this.numColumns) {
			throw 'Bad column #: ' + col;
		}
		return this.columns[col];
	}

	spawnBlockAtRandom(): void {
		var colNum: number = Math.floor(Math.random() * this.numColumns);
	}

	spawnBlock(colIdx: number, color: string): void {
		var col: BoardColumn = this.getColumn(colIdx);
		col.spawnBlock(color);
	}
}

export class BoardColumn {
	blocks: Block[] = [];
	
	constructor() {

	}

	step() {
		this.blocks.forEach((block) => {
			block.step();
		})
	}

	spawnBlock(color: string): void {
		this.blocks.push(new Block());
	}
}

interface PlanetPhysics {
	fallIV: number;
	fallROC: number;

	launchIV: number;		// initial velocity (rising)
	launchROC1: number;		// launch acceleration
	launchROC1Dur: number;	// duration of launchROC1
	launchROC2: number;		// deceleration after ROC1
	launchFinal: number;		// final velocity (falling)

	descentV: number;		// rocket descent velocity. no ROC
}