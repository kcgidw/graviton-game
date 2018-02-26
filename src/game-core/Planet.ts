import { BlockColor, strToColor } from "./BlockTypes";
import { randInt } from "../util";
import { Block } from "./Block";

interface IDistribArrItem {
	color: BlockColor;
	colorStr: string;
	weight: number;
}

export class Planet {
	physics: any;

	inputDistrib: any;
	distribArr: IDistribArrItem[] = [];
	colors: BlockColor[] = [];
	distribSum: number;

	constructor(physics: any, distributions: any) {
		this.physics = physics;
		this.inputDistrib = distributions;

		this.distribSum = 0;
		Object.keys(this.inputDistrib).forEach((colorStr) => {
			this.colors.push(strToColor(colorStr));
			this.distribArr.push({
				color: strToColor(colorStr),
				colorStr: colorStr,
				weight: this.inputDistrib[colorStr],
			});
			this.distribSum += this.inputDistrib[colorStr];
		});
	}

	getRandomColor(): BlockColor {
		let rng = randInt(0,this.distribSum);
		let colorIdx = 0;
		// console.log('rng ' + rng);
		for(; colorIdx < this.distribArr.length; colorIdx++) {
			rng -= this.distribArr[colorIdx].weight;
			if(rng < 0) {
				break;
			}
		}
		// console.log('   ' + this.distribArr[colorIdx].colorStr);
		return this.distribArr[colorIdx].color;
	}
}
