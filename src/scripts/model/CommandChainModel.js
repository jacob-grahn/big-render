/* global createjs */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var CommandChainModel = function() {
		this.clear();
	};

	var p = CommandChainModel.prototype;
	createjs.EventDispatcher.initialize(p);


	p.clear = function() {
		this.commands = [];
		this.targetCommandPos = 0;
	};


	p.setTargetCommandPos = function(targetCommandPos) {
		this.targetCommandPos = targetCommandPos;
		this.dispatchEvent({type: bigRender.event.COMMAND_POS_CHANGED, targetCommandPos: targetCommandPos});
	};


	bigRender.CommandChainModel = CommandChainModel;

}());