/* global createjs */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var CommandDispatcher = function(model, queue) {
		this.model = model;
		this.queue = queue;
		this.commandPos = 0;
		this.removed = false;
		this.processing = false;

		_.bindAll(this, '_commandPosChangedHandler', '_partiallyProcessCommands');
		this._addListeners();
	};

	var p = CommandDispatcher.prototype;
	createjs.EventDispatcher.initialize(p);


	p._addListeners = function() {
		this.model.addEventListener(bigRender.event.COMMAND_POS_CHANGED, this._commandPosChangedHandler);
	};


	p._removeListeners = function() {
		this.model.removeEventListener(bigRender.event.COMMAND_POS_CHANGED, this._commandPosChangedHandler);
	};


	p._commandPosChangedHandler = function(e) {
		this.start();
	};


	p.start = function() {
		this.processing = true;
		if(this.queue) {
			this.task = this.task || this.queue.doRecurring(this._partiallyProcessCommands);
		}
		else {
			this._processCommands();
		}
	};


	p.stop = function() {
		this.processing = false;
		if(this.task) {
			this.task.remove();
			this.task = null;
		}
	};


	p.restart = function() {
		this.clear();
		this.start();
	};


	p.dispatchCommand = function(command, action) {
		var type = command.type + action;
		this.dispatchEvent( {type: type, command:command} );
	};


	p.clear = function() {
		this.stop();
		this.commandPos = 0;
	};


	p.remove = function() {
		this.removed = true;
		this.stop();
		this.removeAllEventListeners();
		this.model = null;
		this.queue = null;
		this.task = null;
	};


	p._dispatchCurrentCommand = function(action) {
		var command = this.model.commands[this.commandPos];
		this.dispatchCommand(command, action);
	};


	p._dispatchProgress = function() {

		//dispatch 'progress' with completed percentage
		var percentCompleted = this.model.targetCommandPos / this.commandPos;
		this.dispatchEvent({type: bigRender.event.PROGRESS, percentCompleted: percentCompleted});

		//dispatch 'complete' if all commands are done
		if(this.commandPos === this.model.targetCommandPos) {
			this.dispatchEvent({type: bigRender.event.COMPLETE});
		}
	};


	p._partiallyProcessCommands = function() {
		var maxTime = 20;
		var startTime = +new Date();
		var elapsed = 0;
		var done = false;

		while(elapsed < maxTime && !done) {
			this._processCommands(10);
			elapsed = +new Date() - startTime;
			if(this.commandPos === this.model.targetCommandPos) {
				done = true;
			}
		}

		if(done) {
			this.stop();
		}
	};


	p._processCommands = function(maxCommands) {
		maxCommands = maxCommands || Infinity;
		var count = 0;

		while(this.commandPos !== this.model.targetCommandPos) {
			if(this.commandPos < this.model.targetCommandPos) {
				this._doNextCommand();
			}
			else {
				this._undoLastCommand();
			}

			count++;
			if(count >= maxCommands) {
				break;
			}
		}

		this._dispatchProgress();
	};


	p._undoLastCommand = function() {
		this.commandPos--;
		this._dispatchCurrentCommand('Undo');
	};


	p._doNextCommand = function() {
		this._dispatchCurrentCommand('Do');
		this.commandPos++;
	};


	bigRender.CommandDispatcher = CommandDispatcher;

}());