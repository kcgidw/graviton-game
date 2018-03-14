import { Board } from "./Board";
import { ClientFacade } from "../client/ClientFacade";
import {Planet} from './Planet';

export class Round {
	BASE_LOGICAL_FPS: number = 60;
	fps: number;
	stepInterval: number;		// in millisec

	board: Board;

	constructor(fps: number) {
		this.fps = fps;
		this.stepInterval = 1000 / fps;
	}

	createBoard(planet: Planet): Board {
		this.board = new Board(this, planet);
		return this.board;
	}
}
