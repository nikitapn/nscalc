class Timer {
	public time: number;
	public dt: number;

	start_time: number;
	prev_time: number;

	constructor() {
		let t = new Date().getTime() / 1000.0;
		this.start_time = t;
		this.time = 0.0;
		this.prev_time = 0.0;
		this.dt = 0.0;
	}

	public update(): void {
		let t = (new Date().getTime() / 1000.0) - this.start_time;
		this.time = t;
		this.dt = t - this.prev_time;
		this.prev_time = t;
	}
} 



export default new Timer();