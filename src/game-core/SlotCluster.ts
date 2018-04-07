import { Block } from "./block/Block";
import { Board } from "./Board";
import { BlockPhysics } from "./block/BlockPhysics";

export class SlotCluster {
	id: number;
	board: Board;
	clusterCols: Map<number, ClusterColumn>;
	anchor: Block;
	
	constructor(board: Board, id: number, bottomBlks: Block[],) {
		this.board = board;
		this.id = id;
		this.clusterCols = new Map();

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
		if(this.clusterCols.get(coli) === undefined) {
			// register this column
			this.clusterCols.set(coli, new ClusterColumn());
		}
		if(this.clusterCols.get(coli).has(blk.physics) === false) {
			this.clusterCols.get(coli).add(blk.physics);
		}

		blk.physics.cluster = this;

		this.updateAnchor();
	}
	remove(blk: Block) {
		var coli = blk.columnIdx;
		if(this.clusterCols.get(coli) !== undefined) {
			this.clusterCols.get(coli).remove(blk.physics);
		}
	}
	absorbCluster(clus: SlotCluster): SlotCluster {
		if(clus === this) return;
		for(let [colIdx, col] of clus.clusterCols) {
			for(let slot of col.slots) {
				this.addOne(slot.block);
			}
		}
		return this;
	}
	getBottomSlots(): BlockPhysics[] {
		var bb: BlockPhysics[] = [];
		for(let cc of this.clusterCols.values()) {
			bb.push(cc.base);
		}
		return bb;
	}
	getBottomBlocks(): Block[] {
		var bb: Block[] = [];
		for(let cc of this.clusterCols.values()) {
			bb.push(cc.base.block);
		}
		return bb;
	}
	updateAnchor() {
		this.anchor = this.getBottomBlocks()[0];
		var bottoms: Block[] = this.getBottomBlocks();
		bottoms.shift();
		for(let b of bottoms) {
			b.physics.anchorTo(this.anchor.physics);
		}
	}
}

class ClusterColumn {
	// TODO shouldn't this hold BlockPhysics, not Blocks?

	slots: Set<BlockPhysics>;
	base: BlockPhysics;
	constructor() {
		this.slots = new Set();
	}
	add(blk: BlockPhysics) {
		this.slots.add(blk);
		if(this.base === undefined || blk.block.slotIdx < this.base.block.slotIdx) {
			this.base = blk;
		}
	}
	has(blk: BlockPhysics): boolean {
		return this.slots.has(blk);
	}
	remove(blk: BlockPhysics) {
		this.slots.delete(blk);
	}
}
