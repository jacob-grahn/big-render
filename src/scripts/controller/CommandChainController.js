var bigRender = bigRender || {};

(function() {
	'use strict';


	var CommandChainController = function(commandChainModel) {
		this.commandChainModel = commandChainModel;
		this.commandDispatcher = new bigRender.CommandDispatcher(commandChainModel, null);
	};

	var p = CommandChainController.prototype;


	p.addCommand = function(command) {
		console.log('addCommand', command);
		var model = this.commandChainModel;
		if(model.commands.length > model.targetCommandPos) {
			model.commands.splice(0, model.targetCommandPos-1);
		}
		if(model.commands.length === model.targetCommandPos) {
			model.targetCommandPos++;
		}
		model.commands.push(command);
		this.commandDispatcher.start();
	};


	p.replaceLastCommand = function(command) {
		this.clearLastCommand();
		this.addCommand(command);
	};


	p.clearLastCommand = function() {
		var model = this.commandChainModel;
		if(model.commands.length > 0) {
			model.targetCommandPos--;
			this.commandDispatcher.start();
			model.commands.pop();
		}
	};


	p.clear = function() {
		var model = this.commandChainModel;
		model.commands = [];
		model.targetCommandPos = 0;
	};


	p.remove = function() {
		this.commandDispatcher.remove();
		this.commandDispatcher = null;
	};


	bigRender.CommandChainController = CommandChainController;

}());