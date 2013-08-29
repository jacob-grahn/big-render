/* global createjs */

var bigRender = bigRender || {};

(function() {
	'use strict';

	var CommandDispatcherEvent = function(type, command) {
		this.type = type;
		this.command = command;
		this.target = null;
	};

	var p = CommandDispatcherEvent.prototype;

	p.COMPLETE = 'complete';
	p.PROGRESS = 'progress';

	bigRender.CommandDispatcherEvent = CommandDispatcherEvent;

}());