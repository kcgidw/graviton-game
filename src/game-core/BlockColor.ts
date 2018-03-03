enum BlockColor {
	RED, YELLOW, MINT, FOREST, AQUA, PURPLE, PINK, BROWN,
}

const COLORS: string[] = ['RED', 'YELLOW', 'MINT', 'FOREST', 'AQUA', 'PURPLE', 'PINK', 'BROWN'];

function colorToFilename(color: BlockColor): string {
	return COLORS[color].toLowerCase();
}

function strToColor(str: string): BlockColor {
	var res = BlockColor[str];
	if(res === undefined) {
		throw new Error('strtocolor ' + str);
	}
	return res;
}

export {BlockColor, COLORS, colorToFilename, strToColor};

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
