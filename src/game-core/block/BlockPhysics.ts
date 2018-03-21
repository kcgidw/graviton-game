import { Block } from "./Block";
import { Timer } from "../Timer";

/* Position, physics, and collision line
Not totally coupled to blocks, i.e. when we swap two blocks, we usually want the block slots to NOT swap
*/
export class BlockPhysics {
	topY: number;
	height: number;

	velocity: number;

	contactBelow: boolean = false;	// is touching a solid directly below
	contactBelowPrev: boolean = false;	// contactBelow for previous frame

	forces: IForceInfo = {
		gravity: 0,
		thrust: 0,
		thrustTimer: undefined,
	};

	constructor(top: number, height: number) {
		this.topY = top;
		this.height = height;
		this.velocity = 20;
	}

	getBottom() {
		return this.topY + this.height;
	}

	collidesBelow(other: BlockPhysics|Block): boolean {
		other = other instanceof Block ? other.physics : other;
		if(this.getBottom() >= other.topY - 1) {
			return true;
		}
		// does NOT check if this is completely under 'other'
		return false;
	}

	setY(y: number): number {
		this.topY = y;
		return this.topY;
	}
	setBottom(y: number): number {
		y -= this.height;
		return this.setY(y);
	}
	move(dist: number): number {
		this.topY += dist;		// positive dist => move down
		return this.topY;
	}
	moveToContact(other: BlockPhysics|Block): number {
		other = other instanceof Block ? other.physics : other;
		if(this.collidesBelow(other)) {
			let dist = other.topY - this.getBottom();
			return this.move(dist);
		}
		return undefined;
	}

	isRising(): boolean {
		return this.velocity > 0;
	}
	isFalling(): boolean {
		return this.velocity < 0;
	}
	isStationary(): boolean {
		return this.velocity === 0;
	}
}

export interface IForceInfo {
	gravity: number;
	thrust: number;
	thrustTimer: Timer;
}