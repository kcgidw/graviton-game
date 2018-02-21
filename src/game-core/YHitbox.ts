// position and collision
export class YHitbox {
	y: number;		// Bottom
	height: number;
	
	constructor(y: number, height: number) {
		this.y = y;
	}

	top(): number {
		return this.y + this.height;
	}

	collidesBelow(other: YHitbox): boolean {
		if(this.y <= other.top()) {
			return true;
		}
		// does NOT check if this is completely under 'other'
		return false;
	}

	move(dist: number): void {
		this.y += dist;
	}
}