import { BlockColor, strToColor } from "./BlockColor";
import { randInt,rand } from "../util";
import { Block } from "./Block";

interface IDistribArrItem {
	color: BlockColor;
	colorStr: string;
	weight: number;
}

export class Planet {
	numColumns: number;

	physics: any;

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
