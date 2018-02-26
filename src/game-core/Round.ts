import { Board } from "./Board";
import { ClientFacade } from "../client/ClientFacade";
import {Planet} from './Planet';

export class Round {
	BASE_LOGICAL_FPS: number = 60;

	stepInterval: number;		// in millisec. Accounts for 'BASE_LOGICAL_FPS'

	board: Board;

	constructor(stepInterval: number) {
		this.stepInterval = stepInterval;
	}

	createBoard(planet: Planet): Board {
		this.board = new Board(this, planet);
		return this.board;
	}
}
