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

		_.bindAll(this, '_commandPosChangedHandler');
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
		/*if(this.queue) {
			if(!this.task) {
				this.task = this.queue.doRecurring(this._doCommands.bind(this));
			}
		}
		else {
			this._processCommands(-1);
		}*/
		this._processCommands(-1);
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
		console.log('CommandDispatcher::dispatchCommand', command, type);
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
		var percentCompleted = this.model.targetCommandPos / this.commandPos;
		this.dispatchEvent( {type: bigRender.event.PROGRESS, percentCompleted: percentCompleted } );

		if(this.commandPos === this.model.targetCommandPos) {
			this.stop();
			this.dispatchEvent( {type: bigRender.event.COMPLETE} );
		}
	};


	p._processCommands = function(maxTime) {
		maxTime = maxTime || 20;
		var model = this.model;
		var startTime = new Date().getTime();
		var elapsed = 0;

		while(this.commandPos !== model.targetCommandPos) {
			if(this.commandPos < model.targetCommandPos) {
				this._doNextCommand();
			}
			else {
				this._undoLastCommand();
			}

			if(maxTime !== -1 && this.commandPos % 5 === 0) {
				elapsed = new Date().getTime() - startTime;
				if(elapsed > maxTime) {
					break;
				}
			}
		}

		if(this.commandPos === model.targetCommandPos) {
			this.stop();
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