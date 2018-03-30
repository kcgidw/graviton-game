import { Block } from "./block/Block";
import { Board } from "./Board";

export class SlotCluster {
	id: number;
	board: Board;
	blocks: Map<number, ClusterColumn>;
	
	constructor(board: Board, id: number, bottomBlks: Block[],) {
		this.board = board;
		this.id = id;
		this.blocks = new Map();

		for(let blk of bottomBlks) {
			this.addBlockAndUp(blk);
		}
	}

	addBlockAndUp(baseBlock: Block) {
		var curBlk: Block = baseBlock;
		while(curBlk !== undefined) {
			this.addOne(curBlk);
			curBlk = this.board.getBlockDirectAbove(curBlk);
		}
	}
	addOne(blk: Block) {
		var coli = blk.columnIdx;
		if(this.blocks.get(coli) === undefined) {
			// register this column
			this.blocks.set(coli, new ClusterColumn());
		}
		if(this.blocks.get(coli).has(blk) === false) {
			this.blocks.get(coli).add(blk);
		}

		blk.physics.cluster = this;
	}
	remove(blk: Block) {
		var coli = blk.columnIdx;
		if(this.blocks.get(coli) !== undefined) {
			this.blocks.get(coli).remove(blk);
		}
	}
	absorbCluster(clus: SlotCluster): SlotCluster {
		for(let [colIdx, col] of clus.blocks) {
			for(let blk of col.blocks) {
				this.addOne(blk);
			}
		}
		return this;
	}
	getBottomBlocks(): Block[] {
		var bb: Block[] = [];
		for(let cc of this.blocks.values()) {
			bb.push(cc.base);
		}
		return bb;
	}
}

class ClusterColumn {
	// TODO shouldn't this hold BlockPhysics, not Blocks?

	blocks: Set<Block>;
	base: Block;
	constructor() {
		this.blocks = new Set();
	}
	add(blk: Block) {
		this.blocks.add(blk);
		if(this.base === undefined || blk.slotIdx < this.base.slotIdx) {
			this.base = blk;
		}
	}
	has(blk: Block): boolean {
		return this.blocks.has(blk);
	}
	remove(blk: Block) {
		this.blocks.delete(blk);
	}
}
