import { Block } from "./block/Block";

/* A match consisting of one straight line */
export class SimpleMatch {
	blocks: Block[] = [];
	isHorizontal: boolean;	// else vertical
	constructor(blocks: Block[], isHorizontal: boolean) {
		this.blocks = blocks;
		this.isHorizontal = isHorizontal;
	}
	add(block: Block) {
		this.blocks.push(block);
	}
}

/* One or more matches that connect/intersect */
export class CompoundMatch {
	simpleMatches: SimpleMatch[] = [];
	blocks: Block[] = [];

	constructor() {}

	attachSimpleMatch(simpleMatch: SimpleMatch) {
		if(this.simpleMatches.indexOf(simpleMatch) === -1) {
			this.simpleMatches.push(simpleMatch);
			for(let blk of simpleMatch.blocks) {
				if(this.blocks.indexOf(blk) === -1) {
					this.blocks.push(blk);
				}
			}
		}
	}
	absorbCompoundMatch(match: CompoundMatch) {
		for(let sm of match.simpleMatches) {
			this.attachSimpleMatch(sm);
		}
	}
	getColumnIdxs(): number[] {
		var colIdxs: number[] = [];
		for(let blk of this.blocks) {
			var col: number = blk.columnIdx;
			if(colIdxs.indexOf(col) === -1) {
				colIdxs.push(col);
			}
		}
		return colIdxs;
	}
	getBottomBlocks(): Block[] {
		var bottoms = {};
		for(let blk of this.blocks) {
			var col = blk.columnIdx;
			var slot = blk.slotIdx;
			if(bottoms[col] === undefined) {
				bottoms[col] = blk;
			} else {
				var compare = bottoms[col];
				if(blk.slotIdx < compare.slotIdx) {
					bottoms[col] = blk;
				}
			}
		}
		return Object.keys(bottoms).map((k) => bottoms[k]);
	}
}

/*
some match scenarios...
F = blocks falling into place

Faa
Faa
a

aFa
 a
 a
	
aFF
 aa
 aa
	
aaF
aaF
  a

*/