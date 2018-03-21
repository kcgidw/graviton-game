import { Board } from "./Board";

enum TimerState {NOT_STARTED, START, PAUSE, STOP}

export class Timer {
	state: TimerState = TimerState.NOT_STARTED;
	time: number;
	alarm: number;
	board: Board;
	action: ()=>any;
	repeats: boolean = false;

	constructor(board: Board, action: ()=>any, alarm: number, repeats?: boolean) {
		this.board=  board;
		this.action = action;
		this.alarm = alarm;
		this.repeats = repeats;
	}

	stop() {
		this.state = TimerState.STOP;
		this.time = undefined;
		return this;
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
	// 	this.state = TimerState.START;
	// 	return this;
	// }
	pause() {
		this.state = TimerState.PAUSE;
		return this;
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
					this.stop();
				}
			}
		}
	}

	alert() {
		this.action();
	}
}
