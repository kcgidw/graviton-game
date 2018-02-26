import { BlockColor, strToColor } from "./BlockTypes";
import { randInt } from "../util";
import { Block } from "./Block";

export class Planet {
	physics: any;

	distributions: any;
	colors: BlockColor[];

	constructor(physics: any, distributions: any) {
		this.physics = physics;
		this.distributions = distributions;
		this.colors = Object.keys(distributions).map((str) => strToColor(str));
		console.log(this.colors);
	}

	getRandomColor(): BlockColor {
		let sum = 0;
		Object.keys(this.distributions).forEach((color) => {
			sum += this.distributions[color];
		});
		let rng = randInt(0,sum);

		// TODO

		return BlockColor.RED;
	}
}
