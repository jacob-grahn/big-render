/* global _ */

var bigRender = bigRender || {};

(function() {
	'use strict';
	
	
	var Queue = function(freq) {
		this.freq = freq || 33;
		this.q = [];
		this.i = 0;
		this.batchSize = 25;
		this.maxClogTime = 10;

		this._runTasksBound = _.bind(this._runTasks, this);

		this.start();
	};
	
	var p = Queue.prototype;
	
	
	p.doRecurring = function(func, interval, repeatCount) {
		interval = interval || this.freq;
		repeatCount = repeatCount || Infinity;
		var task = new bigRender.Task(func, interval, repeatCount);
		this.q.push(task);
		return(task);
	};


	p.doOnce = function(func, delay) {
		delay = delay || 0;
		var task = this.doRecurring(func, delay, 1);
		return(task);
	};


	p.clear = function() {
		for(var i=0; i<this.q.length; i++) {
			var task = this.q[i];
			task.remove();
		}
		this.q = [];
	};


	p.start = function() {
		this.stop();
		this.interval = window.setInterval(this._runTasksBound, this.freq);
	};


	p.stop = function() {
		if(this.interval) {
			window.clearInterval(this.interval);
			this.interval = null;
		}
	};


	p.remove = function() {
		this.stop();
		this.clear();
		this.q = null;
	};


	p._runTasks = function() {
		var startTime = +new Date();
		var taskCount = this.q.length;

		if(this.i >= taskCount) {
			this.i = 0;
		}

		while(this.i < taskCount) {
			var task = this.q[this.i];

			if(task.done) {
				taskCount--;
				this._removeTask(task);
			}

			else {
				this.i++;
				task.run(startTime);
			}

			if(this.i % this.batchSize === 0 && this._getElapsed(startTime) > this.maxClogTime) {
				break;
			}
		}
	};


	p._removeTask = function(task) {
		var index = this.q.indexOf(task);
		this.q.splice(index, 1);
		task.remove();
	};


	p._getElapsed = function(startTime) {
		var curTime = +new Date();
		var elapsedTime = curTime - startTime;
		return(elapsedTime);
	};


	bigRender.Queue = Queue;

}());
