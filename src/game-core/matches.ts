import { Block } from "./Block";

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
			simpleMatch.blocks.forEach((blk) => {
				if(this.blocks.indexOf(blk) === -1) {
					this.blocks.push(blk);
				}
			});
		}
	}
	absorbCompoundMatch(match: CompoundMatch) {
		match.simpleMatches.forEach((sm: SimpleMatch) => {
			this.attachSimpleMatch(sm);
		});
	}
	getBlocks(): Block[] {
		var res: Block[] = [];
		this.simpleMatches.forEach((simp) => {
			res.concat(simp.blocks);
		});
		return res;
	}
}
