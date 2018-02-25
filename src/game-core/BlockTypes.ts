enum BlockColor {
	RED, YELLOW, MINT, FOREST, AQUA, PURPLE, PINK, BROWN,
}

const colors = ['red', 'yellow', 'mint', 'forest', 'aqua', 'purple', 'pink', 'brown'];
function colorToFilename(color: BlockColor) {
	return colors[color];
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

enum BlockType {
	NORMAL, ROCKET, GARBAGE,
}

export {BlockColor, BlockType, colorToFilename};
