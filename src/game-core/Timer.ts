import { Board } from "./Board";

enum TimerState {STOP, START, PAUSE}

export class Timer {
	state: TimerState = TimerState.STOP;
	time: number = 0;
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
		this.time = 0;
		return this;
	}
	start() {
		this.state = TimerState.START;
		return this;
	}
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
