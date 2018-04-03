import { Board } from "./Board";
import { ClientFacade } from "../client/ClientFacade";
import {Planet} from './Planet';
import { Timer } from "./Timer";

export class Round {
	BASE_LOGICAL_FPS: number = 60;
	fps: number;
	stepInterval: number;		// in millisec

	board: Board;

	timers: Set<Timer> = new Set();

	constructor(fps: number) {
		this.fps = fps;
		this.stepInterval = 1000 / fps;
	}

	createBoard(planet: Planet): Board {
		this.board = new Board(this, planet);
		return this.board;
	}

	registerTimer(t: Timer) {
		this.timers.add(t);
	}
	removeTimer(t: Timer) {
		this.timers.delete(t);
	}
}
