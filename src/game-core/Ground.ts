import { YHitbox } from "./YHitbox";

export class Ground {
	hitbox: YHitbox;
	constructor() {
		this.hitbox = new YHitbox(0, 20);
	}
}
