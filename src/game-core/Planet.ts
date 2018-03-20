import { BlockColor, BlockColorUtil } from "./BlockColor";
import { randInt,rand } from "../util";
import { Block } from "./Block";

interface IDistribArrItem {
	color: BlockColor;
	colorStr: string;
	weight: number;
}
export interface IPlanetPhysics {
	blockMass: number;
	garbageMass: number;

	fallIV: number;
	gravity: number;

	thrustIV: number;
	thrustDur: number;
	thrustAccel: number;
	descentCap: number;		// min rocket descent (falling)
}

export class Planet {
	numColumns: number;

	physics: IPlanetPhysics;

	inputDistrib: any;
	distribArr: IDistribArrItem[] = [];
	colors: BlockColor[] = [];
	distribSum: number;

	constructor(data: any) {
		this.numColumns = data.columns;
		this.physics = data.physics;
		this.inputDistrib = data.colors;

		this.distribSum = 0;
		Object.keys(this.inputDistrib).forEach((colorStr) => {
			this.colors.push(BlockColorUtil.strToColor(colorStr));
			this.distribArr.push({
				color: BlockColorUtil.strToColor(colorStr),
				colorStr: colorStr,
				weight: this.inputDistrib[colorStr],
			});
			this.distribSum += this.inputDistrib[colorStr];
		});
	}
}
