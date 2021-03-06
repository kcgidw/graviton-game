import { Block } from "./Block";
import { Timer, TimerState } from "../Timer";
import { SlotCluster } from "../SlotCluster";
import { Planet } from "../Planet";
import { Board } from "../Board";
import { CompoundMatch } from "../matches";

/* Position, physics, and collision line */
export class BlockPhysics {
	planet: Planet;

	topY: number;
	height: number;
	prevY: number;


	contactBelow: boolean = false;	// is touching a solid directly below
	contactBelowPrev: boolean = false;	// contactBelow for previous frame
	processedMovement: boolean = false;
	processedCollision: boolean = false;
	processedDock: boolean = false;

	forces: IForceInfo = {
		gravity: 0,
		thrust: 0,
		thrustAccelTimer: undefined,
	};

	cluster: SlotCluster = undefined;
	fusion: CompoundMatch = undefined;

	block: Block;

	constructor(block: Block, planet: Planet, top: number, height: number, iv: number) {
		this.block = block;
		this.planet = planet;
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
		if(this.getBottom() >= other.topY) {
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

	calcVelocity() {
		var pp = this.planet.physics;

		this.forces.gravity += pp.gravity;
		if(this.forces.gravity > pp.maxGravity) {
			this.forces.gravity = pp.maxGravity;
		}

		// thrust
		if(this.forces.thrustAccelTimer !== undefined) {
			this.forces.thrustAccelTimer.step();
			if(this.forces.thrustAccelTimer.state === TimerState.START) {
				this.forces.thrust += pp.thrustAccel;
				if(this.forces.thrust < pp.maxThrust) {
					this.forces.thrust = pp.maxThrust;
				}
			}
		}
	}
	
	isFalling(): boolean {
		return this.prevY > this.topY;
	}

	launch(board: Board) {
		this.forces.gravity = 0;
		this.forces.thrust = this.planet.physics.thrustIV;
		this.forces.thrustAccelTimer = new Timer(board, () => {}, this.planet.physics.thrustDur, false)
		.start();
	}
}

export interface IForceInfo {
	gravity: number;
	thrust: number;
	thrustAccelTimer: Timer;
}