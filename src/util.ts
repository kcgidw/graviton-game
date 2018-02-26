export function randInt(from: number, to: number, inclusive?: boolean) {
	// inclusive
	var range = to - from;
	var tmp = Math.floor(Math.random() * (range + (inclusive ? 1 : 0)));
	return from + tmp;
}
