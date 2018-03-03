export class Rectangle {
	top: number;
	left: number;
	height: number;
	width: number;
	constructor(top: number, left: number, height: number, width: number) {
		this.top = top;
		this.left = left;
		this.height = height;
		this.width = width;
	}
	getBottom() {
		return this.top + this.height;
	}
	right() {
		return this.left + this.width;
	}
}
