import { BlockType } from "./BlockType";

export enum BlockColor {
	RED, YELLOW, MINT, FOREST, AQUA, PURPLE, PINK, BROWN,
}

export const COLORS: string[] = ['RED', 'YELLOW', 'MINT', 'FOREST', 'AQUA', 'PURPLE', 'PINK', 'BROWN'];

export class BlockColorUtil {
	static colorToFilename(color: BlockColor): string {
		return COLORS[color].toLowerCase();
	}
	static typeToFilename(type: BlockType): string {
		return 'burnt';
	}

	static colorToTexture(color: BlockColor): PIXI.Texture {
		return PIXI.loader.resources[this.colorToFilename(color)].texture;
	}
	static typeToTexture(type: BlockType): PIXI.Texture {
		return PIXI.loader.resources[this.typeToFilename(type)].texture;
	}

	static strToColor(str: string): BlockColor {
		var res = BlockColor[str];
		if(res === undefined) {
			throw new Error('strtocolor ' + str);
		}
		return res;
	}
}

// const BlockColorMap = {
// 	RED: 1,
// 	YELLOW: 2,
// 	MINT: 3,
// 	FOREST: 4,
// 	AQUA: 5,
// 	PURPLE: 6,
// 	PINK: 7,
// 	BROWN: 8,
// 	1: 'RED',
// 	2: 'YELLOW',
// 	3: 'MINT',
// 	4: 'FOREST',
// 	5: 'AQUA',
// 	6: 'PURPLE',
// 	7: 'PINK',
// 	8: 'BROWN',
// };
