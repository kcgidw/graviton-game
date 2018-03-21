import { BlockColor, BlockColorUtil } from "./block/BlockColor";
import { randInt,rand } from "../util";
import { Block } from "./block/Block";

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
		for(let colorKey in this.inputDistrib) {
			this.colors.push(BlockColorUtil.strToColor(colorKey));
			this.distribArr.push({
				color: BlockColorUtil.strToColor(colorKey),
				colorStr: colorKey,
				weight: this.inputDistrib[colorKey],
			});
			this.distribSum += this.inputDistrib[colorKey];
		}
	}
}
