import { BlockType } from "./BlockType";
import { BlockColor } from "./BlockColor";

export interface IBlockSubstance {
	type: BlockType;
	color: BlockColor;
}

export class BlockSubstance {
	type: BlockType;
	color: BlockColor;

	constructor(type: BlockType, color?: BlockColor) {
		this.type = type;
		this.color = color;
	}

	matches(other: BlockSubstance): boolean {
		return this.type === other.type && this.color === other.color;
	}

	setType(t: BlockType) {
		this.type = t;
		
		switch(t) {
			case BlockType.NORMAL:
				break;
			case BlockType.GARBAGE:
			case BlockType.ROCKET:
				this.color = undefined;
				break;
		}
	}

	setColor(c: BlockColor) {
		if(this.type !== BlockType.NORMAL) {
			console.log('bad setColor');
		}
		this.color = c;
	}
}