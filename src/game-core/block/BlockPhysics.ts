import { Block } from "./Block";
import { Timer } from "../Timer";
import { SlotCluster } from "../SlotCluster";

/* Position, physics, and collision line
AKA "Slots," not entirely coupled to blocks.
Think of it as the wireframe of a block's position.
*/
export class BlockPhysics {
	topY: number;
	height: number;
	prevY: number;

	contactBelow: boolean = false;	// is touching a solid directly below
	contactBelowPrev: boolean = false;	// contactBelow for previous frame

	forces: IForceInfo = {
		gravity: 0,
		thrust: 0,
		thrustAccelTimer: undefined,
	};

	cluster: SlotCluster;

	constructor(top: number, height: number, iv: number) {
		this.topY = top;
		this.prevY = top;
		this.height = height;
		this.forces.gravity = iv;
	}

	getBottom() {
		return this.topY + this.height;
	}

	collidesBelow(other: BlockPhysics|Block): boolean {
		other = other instanceof Block ? other.physics : other;
		if(this.getBottom() >= other.topY - 1) {
			return true;
		}
		// does NOT check if this is completely below 'other'. For now, that should be impossible.
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

	// isRising(): boolean {
	// 	return this.velocity > 0;
	// }
	isFalling(): boolean {
		return this.prevY > this.topY;
	}
	// isStationary(): boolean {
	// 	return this.velocity === 0;
	// }
}

export interface IForceInfo {
	gravity: number;
	thrust: number;
	thrustAccelTimer: Timer;
}