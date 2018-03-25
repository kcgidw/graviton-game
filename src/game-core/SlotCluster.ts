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
			let curBlk: Block = blk;
			while(curBlk !== undefined) {
				this.add(curBlk);
				curBlk = this.board.getBlockDirectAbove(curBlk);
			}
		}
	}

	add(blk: Block) {
		var coli = blk.columnIdx;
		if(this.blocks.get(coli) === undefined) {
			this.blocks.set(coli, new ClusterColumn());
		}
		this.blocks.get(coli).add(blk);

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
				this.add(blk);
			}
		}
		return this;
	}
}

class ClusterColumn {
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
	remove(blk: Block) {
		this.blocks.delete(blk);
	}
}
