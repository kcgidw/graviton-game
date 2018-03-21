import { YHitbox } from "./block/YHitbox";

export class Ground {
	hitbox: YHitbox;
	constructor() {
		this.hitbox = new YHitbox(0, 20);
	}
}
