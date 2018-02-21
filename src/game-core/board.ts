class Board {
	physics: PlanetPhysics;
	columns: BoardColumn[];

	constructor() {

	}

	spawnBlock(): void {

	}
}

class BoardColumn {
	blocks: Block[];
	
	constructor() {

	}

	spawnBlock(): void {

	}
}

interface PlanetPhysics {
	fallIV: number;
	fallROC: number;

	launchIV: number;
	launchROC1: number;		// launch acceleration
	launchROC1Dur: number;	// duration of launchROC1
	launchROC2: number;		// deceleration after ROC1

	descentV: number;		// rocket descent velocity. no ROC
}

export {Board};