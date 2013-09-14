var bigRender = bigRender || {};

(function() {
	'use strict';


	var Task = function(callback, freq, count) {
		this.callback = callback;
		this.freq = freq || 33;
		this.count = count || 0;
		this.lastTime = +new Date();
		this.done = false;
	};
	
	var p = Task.prototype;
	
	
	p.run = function(curTime) {
		var elapsed = curTime - this.lastTime;
		if(elapsed >= this.freq) {
			this.lastTime = curTime;
			this.callback(this);
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
