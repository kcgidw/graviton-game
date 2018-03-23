import {Block, IMatchInfo} from './block/Block';
import {BlockColor, COLORS} from './block/BlockColor';
import {ClientFacade} from '../client/ClientFacade';
import {Rectangle} from './Rectangle';
import {BlockPhysics} from './block/BlockPhysics';
import { Round } from './Round';
import { Planet } from './Planet';
import { rand, randInt } from '../util';
import { Timer, TimerState } from './Timer';
import { CompoundMatch, SimpleMatch } from './matches';
import { BlockType } from './block/BlockType';

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

	ground: BlockPhysics;
	blocks: Block[][] = [];
	blocksMap: any = {};		// maps id to block

	spawnInterval: number;
	spawner: Timer;

	facade: ClientFacade;

	blockId: number = 0;

	tick: number = 0;
	time: number = 0;

	lastRandomSpawnColumn: number;		// column where the board last randomly spawned a block

	debugMaxBlocks: number;

	isDirtyForMatches: boolean = false;
	compoundMatches: CompoundMatch[] = [];

	constructor(engine: Round, planet: Planet, facade?: ClientFacade) {
		this.engine = engine;
		this.planet = planet;
		this.numColumns = this.planet.numColumns;
		this.dimensions = new Rectangle(0, 0, this.numRows * Block.HEIGHT, this.numColumns * Block.HEIGHT);

		for(let i=0; i<this.numColumns; i++) {
			this.blocks.push([]);
		}
		this.facade = facade;

		this.ground = new BlockPhysics(this.dimensions.getBottom(), Block.HEIGHT, 0);
		// this.ground.velocity = 0;

		this.spawner = new Timer(this, () => {
			var res = this.spawnBlockRandom();
			if(!res) {
				this.spawner.kill();
			}
		}, this.planet.spawner.startInterval, true).start();

		console.log(this);
	}

	forEachBlock(fn: (block: Block, colIdx?: number, slotIdx?: number)=>any) {
		this.blocks.forEach((col, colIdx) => {
			col.forEach((block, slotIdx) => {	// forEach iterates in asc order
				fn(block, colIdx, slotIdx);
			});
		});
	}
	getBlock(blockId: number): Block {
		return this.blocksMap[blockId];
	}
	getBlockAbove(block: Block): Block {
		if(typeof block === 'number') {block = this.getBlock(block);}
		let colIdx = block.columnIdx;
		let slotIdx = block.slotIdx;
		return this.blocks[colIdx][slotIdx + 1];
	}
	getBlockBelow(block: Block): Block {
		if(typeof block === 'number') {block = this.getBlock(block);}
		let colIdx = block.columnIdx;
		let slotIdx = block.slotIdx;
		return this.blocks[colIdx][slotIdx - 1];
	}
	getBlockDirectBelow(block: Block): Block {
		var res = this.getBlockBelow(block);
		if(res && res.physics.topY === block.physics.getBottom()) {
			return res;
		}
		return undefined;
	}
	getBlockDirectAbove(block: Block): Block {
		var res = this.getBlockAbove(block);
		if(res && res.physics.getBottom() === block.physics.topY) {
			return res;
		}
		return undefined;
	}

	step() {
		this.time += this.engine.stepInterval;

		if(this.debugMaxBlocks && this.blockId > this.debugMaxBlocks) {
			this.spawner.kill();
		} else {
			this.spawner.step();
		}

		if(this.isDirtyForMatches) {
			this.compoundMatches = this.processMatches();
			/* ignitions */
			if(this.compoundMatches) {
				this.compoundMatches.forEach((comp) => {
					for(let blk of comp.blocks) {
						blk.setType(BlockType.ROCKET);
					}
					var bottomBlks: Block[] = comp.getBottomBlocks();
					for(let blk of bottomBlks) {
						let physics = blk.physics;
						physics.forces.gravity = 0;
						physics.forces.thrust = this.planet.physics.thrustIV;
						// physics.velocity = this.planet.physics.thrustIV;
						physics.forces.thrustAccelTimer = new Timer(this, () => {}, this.planet.physics.thrustDur, false)
							.start();
					}
				});
			}
			this.isDirtyForMatches = false;
		}

		/* block physics */
		this.forEachBlock((block, colIdx, slotIdx) => {
			var bp = block.physics;
			var pp = this.planet.physics;
			bp.contactBelowPrev = bp.contactBelow;

			bp.forces.gravity += pp.gravity;
			if(bp.forces.gravity > pp.maxGravity) {
				bp.forces.gravity = pp.maxGravity;
			}

			if(bp.forces.thrustAccelTimer !== undefined) {
				bp.forces.thrustAccelTimer.step();
				if(bp.forces.thrustAccelTimer.state === TimerState.START) {
					bp.forces.thrust += pp.thrustAccel;
					if(bp.forces.thrust < pp.maxThrust) {
						bp.forces.thrust = pp.maxThrust;
					}
				}
			}

			var velocity = bp.forces.gravity + bp.forces.thrust;
			bp.topY += velocity * this.engine.BASE_LOGICAL_FPS / this.engine.fps;


			var hitboxBelow: BlockPhysics;
			var velBelow: number;
			var gravBelow: number;
			if(slotIdx === 0) {
				hitboxBelow = this.ground;
				velBelow = 0;
				gravBelow = 0;
			} else {
				var blkBelow = this.blocks[block.columnIdx][slotIdx - 1];
				hitboxBelow = blkBelow.physics;
				// velBelow = blkBelow.physics.velocity;
				gravBelow = blkBelow.physics.forces.gravity;
			}
			if(bp.collidesBelow(hitboxBelow)) {
				bp.moveToContact(hitboxBelow);
				bp.contactBelow = true;
				bp.forces.gravity = gravBelow;
				bp.forces.thrust = 0;
				if(bp.forces.thrustAccelTimer) {
					bp.forces.thrustAccelTimer.kill();
				}
				// bp.velocity = velBelow;
				if(block.selectable === false) {
					block.activateSelectable();
				}
				if(bp.contactBelowPrev === false) {
					this.isDirtyForMatches = true;
				}
			} else if (! this.getBlockDirectBelow(block)) {
				bp.contactBelow = false;
			}
		});

		this.processEscapedBlocks();	// TODO


		this.tick++;
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
		var slotIdx = col.length;
		var block: Block = new Block(colIdx, slotIdx, BlockType.NORMAL, this.blockId++, this.planet.physics.fallIV)
			.setColor(color);
		col.push(block);
		this.blocksMap[block.id] = block;
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
	chooseColor(colIdx: number, slotIdx: number): BlockColor {
		var color: BlockColor = this.getRandomColor();
		var tried = {};
		while(this.validateColor(colIdx, slotIdx, color) === false) {
			tried[color] = 0;
			// get a new random color that hasn't been tried yet
			while(tried[color] !== undefined) {
				color = this.getRandomColor();
			}
		}
		return color;
	}
	getColorAt(colIdx: number, slotIdx: number): BlockColor {
		var col: Block[] = this.blocks[colIdx];
		if(col === undefined) {
			return undefined;
		}
		var blk: Block = col[slotIdx];
		return blk ? blk.color : undefined;
	}

	// checks if placing a color at a certain columnXslot could create a natural match-3
	validateColor(colIdx: number, slotIdx: number, color: BlockColor): boolean {
		// check horiz
		var slotRange: Block[] = this.blocks.map((col) => (col[slotIdx]));
		var neighbor0: BlockColor =this.getColorAt(colIdx-2, slotIdx);
		var neighbor1: BlockColor =this.getColorAt(colIdx-1, slotIdx);
		var neighbor2: BlockColor =this.getColorAt(colIdx+1, slotIdx);
		var neighbor3: BlockColor =this.getColorAt(colIdx+2, slotIdx);
		if((neighbor0 === color && neighbor1 === color)
			|| (neighbor1 === color && neighbor2 === color)
			|| (neighbor2 === color && neighbor3 === color)) {
			return false;
		}

		// check vert
		var colRange: Block[] = this.blocks[colIdx];
		neighbor0 =this.getColorAt(colIdx, slotIdx-2);
		neighbor1 =this.getColorAt(colIdx, slotIdx-1);
		neighbor2 =this.getColorAt(colIdx, slotIdx+1);
		neighbor3 =this.getColorAt(colIdx, slotIdx+2);
		if((neighbor0 === color && neighbor1 === color)
			|| (neighbor1 === color && neighbor2 === color)
			|| (neighbor2 === color && neighbor3 === color)) {
			return false;
		}

		return true;		// no potential matches found
	}

	processEscapedBlocks() {

	}

	swapBlocks(a: Block, b: Block): void {
		// TODO run within the step logic, not outside it
		if(!a.selectable || !b.selectable) {
			return;
		}
		if(a.columnIdx !== b.columnIdx) {
			return;
		}
		if(Math.abs(a.slotIdx - b.slotIdx) !== 1) {
			return;
		}

		var col = a.columnIdx;
		var tmpA: Block = a;
		var tmpASlotIdx: number = a.slotIdx;
		var tmpAHitboxTop: number = a.physics.topY;
		// var tmpAType: BlockType = a.type;
		// var tmpAColor: BlockColor = a.color;
		var tmpAPhysics = a.physics;
		// var tmpAVel = a.physics.velocity;
		// var tmpBVel = b.physics.velocity;

		this.blocks[col][a.slotIdx] = b;
		this.blocks[col][b.slotIdx] = tmpA;

		a.slotIdx = b.slotIdx;
		b.slotIdx = tmpASlotIdx;

		a.physics = b.physics;
		// a.physics.velocity = tmpAVel;
		b.physics = tmpAPhysics;
		// b.physics.velocity = tmpBVel;

		this.isDirtyForMatches = true;
		console.log(a);
		console.log(b);
	}
	swapUp(block: Block): void {
		var other: Block =  this.getBlockDirectAbove(block);
		if(other) {
			this.swapBlocks(block,other);
		}
	}
	swapDown(block: Block): void {
		var other: Block =  this.getBlockDirectBelow(block);
		if(other) {
			this.swapBlocks(block,other);
		}
	}

	setFacade(facade: ClientFacade): ClientFacade {
		this.facade = facade;
		return this.facade;
	}

	processMatches(): CompoundMatch[] {
		this.compoundMatches = [];

		this.forEachBlock((blk) => {
			blk.matchInfo = undefined;
		});

		var allMatchBlocks: Block[] = [];

		/* Generate simple matches */
		for(let colIdx=0; colIdx<this.numColumns; colIdx++) {
			for(let slotIdx=0; slotIdx<this.blocks[colIdx].length; slotIdx++) {
				let refBlk: Block = this.blocks[colIdx][slotIdx];
				if(refBlk) {
					refBlk.matchInfo = refBlk.matchInfo ? refBlk.matchInfo : {};
					if(refBlk.matchInfo.hor === undefined) {
						let match: SimpleMatch = new SimpleMatch([refBlk], true);
						for(let i=colIdx + 1; i<this.numColumns; i++) {
							let compareBlk: Block = this.blocks[i][slotIdx];
							if(compareBlk !== undefined && refBlk.hasNormalMatch(compareBlk)) {
								match.add(compareBlk);
							} else {
								break; // non-existent or non-match. No more matches can follow
							}
						}
						// if is a valid simple match, then attach info to each of its blocks
						if(match.blocks.length >= 3) {
							for(let blk of match.blocks) {
								blk.matchInfo = blk.matchInfo ? blk.matchInfo : {};
								blk.matchInfo.hor = match;
								if(allMatchBlocks.indexOf(blk) === -1) {
									allMatchBlocks.push(blk);
								}
							}
						}
					}
	
					if(refBlk.matchInfo.ver === undefined) {
						let match: SimpleMatch = new SimpleMatch([refBlk], false);
						for(let i=slotIdx + 1; i<this.blocks[colIdx].length; i++) {
							let compareBlk: Block = this.blocks[colIdx][i];
							if(compareBlk !== undefined && refBlk.hasNormalMatch(compareBlk)) {
								match.add(compareBlk);
							} else {
								break;
							}
						}
						if(match.blocks.length >= 3) {
							for(let blk of match.blocks) {
								blk.matchInfo = blk.matchInfo ? blk.matchInfo : {};
								blk.matchInfo.ver = match;
								if(allMatchBlocks.indexOf(blk) === -1) {
									allMatchBlocks.push(blk);
								}
							}
						}
					}
				}
			}
		}

		/*
		Convert simple matches into compound matches.
		If a simple match intersects with another simple match, attach the other into the compound.
		If the other is also a part of a compound, merge the two compounds.
		*/
		for(let refBlk of allMatchBlocks) {
			let refMatch: IMatchInfo = refBlk.matchInfo;

			if(refMatch !== undefined) {	// then blk is part of at least 1 match
				if(refMatch.compound === undefined) {
					refMatch.compound = new CompoundMatch();
				}
				['hor','ver'].forEach((simp) => {
					if(refMatch[simp] !== undefined) {
						let simple = refMatch[simp];
						refMatch.compound.attachSimpleMatch(simple);
						for(let simpleMember of simple.blocks) {
							let toAbsorb: CompoundMatch = simpleMember.matchInfo.compound;
							if(toAbsorb !== undefined && toAbsorb !== refMatch.compound) {
								refMatch.compound.absorbCompoundMatch(toAbsorb);
							}
							simpleMember.matchInfo.compound = refMatch.compound;
						}
					}
				});
			}
		}

		var compounds: CompoundMatch[] = [];
		for(let blk of allMatchBlocks) {
			// if the selected block is in a match, deselect it
			if(this.facade && this.facade.selectedBlock && blk === this.facade.selectedBlock.block) {
				this.facade.selectBlock(undefined);
			}
			
			var comp = blk.matchInfo.compound;
			if(compounds.indexOf(comp) === -1) {
				compounds.push(comp);
			}
		}

		if(compounds.length > 0) {		// any matches this step?
			console.log(compounds);
		}
		return compounds;
	}
}
