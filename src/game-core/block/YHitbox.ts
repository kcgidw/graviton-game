// position and collision
export class YHitbox {
	top: number;
	height: number;

	constructor(top: number, height: number) {
		this.top = top;
		this.height = height;
	}

	getBottom() {
		return this.top + this.height;
	}

	collidesBelow(other: YHitbox): boolean {
		if(this.getBottom() >= other.top - 1) {
			return true;
		}
		// does NOT check if this is completely under 'other'
		return false;
	}

	setY(y: number): number {
		this.top = y;
		return this.top;
	}
	setBottom(y: number): number {
		y -= this.height;
		return this.setY(y);
	}
	move(dist: number): number {
		this.top += dist;		// positive dist => move down
		return this.top;
	}
	moveToContact(other: YHitbox): number {
		if(this.collidesBelow(other)) {
			let dist = other.top - this.getBottom();
			return this.move(dist);
		}
		return undefined;
	}
}
