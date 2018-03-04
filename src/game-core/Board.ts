import {Block} from './Block';
import {BlockColor, COLORS} from './BlockColor';
import {ClientFacade} from '../client/ClientFacade';
import {Rectangle} from './Rectangle';
import { YHitbox } from './YHitbox';
import { Round } from './Round';
import { Planet } from './Planet';
import { rand, randInt } from '../util';
import { Timer } from './Timer';

/* TODO
- Load a cache of block objects?
*/

export class Board {
	engine: Round;

	planet: Planet;
	dimensions: Rectangle;
	numRows: number = 12;
	numColumns: number;
	colors: BlockColor[] = [];

	ground: YHitbox;
	blocks: Block[][] = [];

	spawnInterval: number = 0.05 * 1000;
	spawner: Timer;

	facade: ClientFacade;

	blockId: number = 0;

	tick: number = 0;
	time: number = 0;

	lastRandomSpawnColumn: number;		// column where the board last randomly spawned a block

	debugMaxBlocks: number;

	constructor(engine: Round, planet: Planet, facade?: ClientFacade) {
		this.engine = engine;
		this.planet = planet;
		this.numColumns = this.planet.numColumns;
		this.dimensions = new Rectangle(0, 0, this.numRows * Block.HEIGHT, this.numColumns * Block.HEIGHT);

		for(let i=0; i<this.numColumns; i++) {
			this.blocks.push([]);
		}
		this.facade = facade;

		this.ground = new YHitbox(this.dimensions.getBottom(), Block.HEIGHT);

		this.spawner = new Timer(this, () => {
			var res = this.spawnBlockRandom();
			if(!res) {
				this.spawner.stop();
			}
		}, this.spawnInterval, true).start();

		console.log(this);
	}

	forEachBlock(fn: (block: Block, idx: number)=>any) {
		this.blocks.forEach((col) => {
			col.forEach((block, idx) => {
				fn(block, idx);
			});
		});
	}

	step() {
		this.time += this.engine.stepInterval;

		this.forEachBlock((block, idx) => {

			// block physics

			block.hitbox.top = block.hitbox.top + (block.curVelocity * this.engine.BASE_LOGICAL_FPS / this.engine.stepInterval);

			if(idx === 0 && block.hitbox.collidesBelow(this.ground)) {
				block.hitbox.moveToContact(this.ground);
			} else {
				let nextBlock: Block = this.blocks[block.columnIdx][idx - 1];
				if(nextBlock && block.hitbox.collidesBelow(nextBlock.hitbox)) {
					block.hitbox.moveToContact(nextBlock.hitbox);
				}
			}

		});

		if(this.debugMaxBlocks && this.blockId > this.debugMaxBlocks) {
			this.spawner.stop();
		} else {
			this.spawner.step();
		}

		this.tick++;
	}

	// Returns the next block under this one, even if they aren't in contact
	getNextBlockBelow(block: Block): Block {
		let colIdx = block.columnIdx;
		let stackIdx = block.stackIdx;
		if(stackIdx === 0) {
			return null;
		}
		return this.blocks[colIdx][stackIdx - 1];
	}

	getRandomColumnIdx(): number {
		let idx = randInt(0, this.numColumns);
		return idx;
	}
	columnIsFull(colIdx: number): boolean {
		return this.blocks[colIdx].length >= this.numRows;
	}
	getNonFullColumnsIdxs(): number[] {
		var res: number[] = [];
		for(let i=0; i<this.numColumns; i++) {
			if(this.columnIsFull(i) === false) {
				res.push(i);
			}
		}
		return res;
	}
	getRandomNonFullColumnIdx(): number {
		var openColumns: number[] = this.getNonFullColumnsIdxs();
		if(openColumns.length === 0) {
			return undefined;
		}
		var colIdx = openColumns[randInt(0, openColumns.length)];
		return colIdx;
	}
	spawnBlock(colIdx: number, color: BlockColor): Block {
		var col: Block[] = this.blocks[colIdx];
		var stackIdx = col.length;
		var block: Block = new Block(colIdx, stackIdx, color, this.blockId++);
		col.push(block);
		return block;
	}
	spawnBlockRandom(): Block {
		var colIdx: number = this.getRandomNonFullColumnIdx();
		if(colIdx === undefined) {
			return undefined;
		}
		return this.spawnBlock(colIdx, this.chooseColor(colIdx, this.blocks[colIdx].length));
	}

	getRandomColor(): BlockColor {
		let rng = rand(0,this.planet.distribSum);
		let colorIdx = 0;
		// console.log('rng ' + rng);
		for(; colorIdx < this.planet.distribArr.length; colorIdx++) {
			rng -= this.planet.distribArr[colorIdx].weight;
			if(rng < 0) {
				break;
			}
		}
		// console.log('   ' + this.distribArr[colorIdx].colorStr);
		return this.planet.distribArr[colorIdx].color;
	}
	chooseColor(colIdx: number, stackIdx: number): BlockColor {
		var color: BlockColor = this.getRandomColor();
		var tried = {};
		while(this.validateColor(colIdx, stackIdx, color) === false) {
			tried[color] = 0;
			// get a new random color that hasn't been tried yet
			while(tried[color] !== undefined) {
				color = this.getRandomColor();
			}
		}
		return color;
	}
	getColorAt(colIdx: number, stackIdx: number): BlockColor {
		var col: Block[] = this.blocks[colIdx];
		if(col === undefined) {
			return undefined;
		}
		var blk: Block = col[stackIdx];
		return blk ? blk.color : undefined;
	}

	// checks if placing a color at a certain columnXstack could create a natural match-3
	validateColor(colIdx: number, stackIdx: number, color: BlockColor): boolean {
		// check adjacent columns
		var stackRange: Block[] = this.blocks.map((col) => (col[stackIdx]));
		var neighbor0: BlockColor =this.getColorAt(colIdx-2, stackIdx);
		var neighbor1: BlockColor =this.getColorAt(colIdx-1, stackIdx);
		var neighbor2: BlockColor =this.getColorAt(colIdx+1, stackIdx);
		var neighbor3: BlockColor =this.getColorAt(colIdx+2, stackIdx);
		if((neighbor0 === color && neighbor1 === color)
			|| (neighbor1 === color && neighbor2 === color)
			|| (neighbor2 === color && neighbor3 === color)) {
			return false;
		}

		// check adjacent blocks in the same column
		var colRange: Block[] = this.blocks[colIdx];
		neighbor0 =this.getColorAt(colIdx, stackIdx-2);
		neighbor1 =this.getColorAt(colIdx, stackIdx-1);
		neighbor2 =this.getColorAt(colIdx, stackIdx+1);
		neighbor3 =this.getColorAt(colIdx, stackIdx+2);
		if((neighbor0 === color && neighbor1 === color)
			|| (neighbor1 === color && neighbor2 === color)
			|| (neighbor2 === color && neighbor3 === color)) {
			return false;
		}

		return true;		// no potential matches found
	}

	setFacade(facade: ClientFacade): ClientFacade {
		this.facade = facade;
		return this.facade;
	}
}
