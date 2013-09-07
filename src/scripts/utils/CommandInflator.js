/* global _ */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var CommandInflator = function(defaults) {
		this.defaults = defaults;
		this.saved = _.clone(defaults);
	};

	var p = CommandInflator.prototype;


	p.clear = function() {
		this.saved = _.clone(this.defaults);
	};


	p.inflateCommand = function(command) {
		for (var key in this.saved) {
			if (!command[key]) {
				command[key] = this.saved[key];
			}
			else {
				this.saved[key] = command[key];
			}
		}
	};


	p.deflateCommand = function(command) {
		for (var key in this.saved) {
			if (command[key] === this.saved[key]) {
				delete command[key];
			}
		}
	};


	bigRender.CommandInflator = CommandInflator;
}());