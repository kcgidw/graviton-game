export function randInt(from: number, to: number, inclusive?: boolean) {
	var range = to - from;
	var tmp = Math.floor(Math.random() * (range + (inclusive ? 1 : 0)));
	return from + tmp;
}
export function rand(from: number, to: number) {
	// to-exclusive
	var range = to - from;
	var tmp = Math.random() * range;
	return from + tmp;
}