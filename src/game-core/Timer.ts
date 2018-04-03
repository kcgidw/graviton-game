import { Board } from "./Board";
import { Round } from "./Round";

export enum TimerState {NOT_STARTED, START, PAUSE, END}

export class Timer {
	round: Round;
	board: Board;

	state: TimerState = TimerState.NOT_STARTED;
	time: number;
	alarm: number;
	action: ()=>any;
	repeats: boolean = false;

	constructor(board: Board, action: ()=>any, alarm: number, repeats?: boolean) {
		this.round = board.engine;
		this.board=  board;

		this.action = action;
		this.alarm = alarm;
		this.repeats = repeats;

		this.round.registerTimer(this);
	}

	step() {
		if(this.state === TimerState.START) {
			this.time += this.board.engine.stepInterval;

			if(this.repeats === true) {
				let numTriggers = 0;
				while(this.time > this.alarm) {
					this.alert();
					this.time -= this.alarm;
					numTriggers++;
				}
			} else {
				if(this.time > this.alarm) {
					this.alert();
					this.kill();
				}
			}
		}
	}

	start() {
		if(this.state === TimerState.START) {
			throw new Error('timer already started');
		}
		this.state = TimerState.START;
		this.time = 0;
		return this;
	}
	// resume() {
	// }
	pause() {
		this.state = TimerState.PAUSE;
		return this;
	}
	kill() {
		this.state = TimerState.END;
		this.time = undefined;
		this.round.removeTimer(this);
		return this;
	}

	alert() {
		this.action();
	}
}
