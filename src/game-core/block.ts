class YHitbox {
	y: number;		// Bottom
	height: number;
	
	constructor(y: number,height: number) {
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
		// within the scope of the game, that should be impossible
		return false;
	}

	move(dist: number): void {
		this.y += dist;
	}
}

class BlockPhysics {
	hitbox: YHitbox;
	curVelocity: number;

	constructor() {
		this.hitbox = new YHitbox(1, 1);
	}

 	move(dist: number): void {
		// if dist is negative, it's falling

		// move all blocks above the same way

		// if falling, ensure proper collision with any solids below
	}

	isRising(): boolean {
		return this.curVelocity > 0;
	}
	isFalling(): boolean {
		return this.curVelocity < 0;
	}
	isStationary(): boolean {
		return this.curVelocity === 0;
	}
}

const blockTypes = ['NORMAL', 'ROCKET', 'GARBAGE'];
const blockElements = ['RED', 'YELLOW', 'MINT', 'FOREST', 'BROWN', 'AQUA', 'PURPLE', 'PINK'];

class Block extends BlockPhysics {
	stationary: boolean;
	snapped: boolean;		// is aligned to board grid
}