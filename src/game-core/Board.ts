import {Block} from './Block';
import {BlockColor,COLORS} from './BlockTypes';
import {ClientFacade} from '../client/ClientFacade';
import {Box2d} from './Box2d';
import { YHitbox } from './YHitbox';
import { Round } from './Round';
import { Planet } from './Planet';
import { randInt } from '../util';

/* TODO
- Load a cache of block objects?
*/

const blockHeight = 100;

export class Board {
	engine: Round;

	planet: Planet;
	dimensions: Box2d;
	numRows: number = 12;
	numColumns: number;
	colors: BlockColor[] = [];
	physics: IPlanetPhysics;

	ground: YHitbox;
	blocks: Block[][] = [];

	spawnInterval: number = 0.4 * 1000;
	spawner: Timer;

	facade: ClientFacade;

	blockId: number = 0;

	tick: number = 0;
	time: number = 0;

	constructor(engine: Round, planet: Planet, facade?: ClientFacade) {
		this.engine = engine;
		this.planet = planet;
		this.numColumns = this.planet.numColumns;
		this.dimensions = new Box2d(0, 0, this.numRows * blockHeight, this.numColumns * blockHeight);

		for(let i=0; i<this.numColumns; i++) {
			this.blocks.push([]);
		}
		this.facade = facade;

		this.ground = new YHitbox(this.dimensions.getBottom(), 100);

		let spawnerInterval = 0.4 * 1000;
		this.spawner = new Timer(this, () => {
			this.spawnBlockRandom();
		}, spawnerInterval, true).start();

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

		if(this.blockId > 100) {
			return;
		}

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

		this.tick++;
		this.spawner.step();
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
		let idx = randInt(0, this.numColumns);
		return idx;
	}
	spawnBlock(colIdx: number, color: BlockColor): Block {
		var col: Block[] = this.blocks[colIdx];
		var blockIdx = col.length;
		var block: Block = new Block(colIdx, blockIdx, color, this.blockId++);
		col.push(block);
		return block;
	}
	spawnBlockRandom(): Block {
		return this.spawnBlock(this.blockId === 0 ? 2 : this.getRandomColumnIdx(), this.planet.getRandomColor());
	}

	setFacade(facade: ClientFacade): ClientFacade {
		this.facade = facade;
		return this.facade;
	}
}

enum TimerState {STOP, START, PAUSE}
class Timer {
	state: TimerState = TimerState.STOP;
	time: number = 0;
	alarm: number;
	board: Board;
	action: ()=>any;
	repeats: boolean = false;

	constructor(board: Board, action: ()=>any, alarm: number, repeats?: boolean) {
		this.board=  board;
		this.action = action;
		this.alarm = alarm;
		this.repeats = repeats;
	}

	stop() {
		this.state = TimerState.STOP;
		this.time = 0;
		return this;
	}
	start() {
		this.state = TimerState.START;
		return this;
	}
	pause() {
		this.state = TimerState.PAUSE;
		return this;
	}

	step() {
		if(this.state === TimerState.START) {
			this.time += this.board.engine.stepInterval;

			if(this.repeats === true) {
				let numTriggers = 0;
				while(this.time > this.alarm) {
					this.alert();
					this.time -= this.alarm;
					numTriggers++;
				}
			} else {
				if(this.time > this.alarm) {
					this.alert();
					this.stop();
				}
			}
		}
	}

	alert() {
		this.action();
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
