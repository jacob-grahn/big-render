var bigRender = bigRender || {};

(function() {
	'use strict';


	var Task = function(callback, freq, count) {
		this.callback = callback;
		this.freq = freq || 33;
		this.count = count || 0;
		this.lastTime = +new Date();
		this.done = false;
		this.minFrames = 0;
		this.frames = 0;
	};
	
	var p = Task.prototype;
	
	
	p.run = function(curTime) {
		this.frames++;
		var elapsed = curTime - this.lastTime;
		if(elapsed >= this.freq && this.frames >= this.minFrames) {
			this.lastTime = curTime;
			this.frames = 0;
			this.callback();
			this.count--;
			if(this.count <= 0) {
				this.done = true;
			}
		}
	};


	p.remove = function() {
		this.done = true;
		this.callback = null;
	};
	

	bigRender.Task = Task;
}());
