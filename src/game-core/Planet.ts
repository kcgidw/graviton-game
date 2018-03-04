import { BlockColor, strToColor } from "./BlockColor";
import { randInt,rand } from "../util";
import { Block } from "./Block";

interface IDistribArrItem {
	color: BlockColor;
	colorStr: string;
	weight: number;
}
interface IPlanetPhysics {
	blockMass: number;
	garbageMass: number;
	fallIV: number;
	gravity: number;

	launchIV: number;		// initial velocity (rising)
	launchAccel: number;	// launch acceleration
	launchAccelDur: number;	// duration of launchROC1
	launchMin: number;		// min rocket descent (falling)
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
			this.colors.push(strToColor(colorStr));
			this.distribArr.push({
				color: strToColor(colorStr),
				colorStr: colorStr,
				weight: this.inputDistrib[colorStr],
			});
			this.distribSum += this.inputDistrib[colorStr];
		});
	}
}
