var bigRender = bigRender || {};

(function() {
	'use strict';


	var CommandPrepper = function() {
		this.inflators = {
			moveRect: new bigRender.CommandInflator({}),
			eraseRect: new bigRender.CommandInflator({}),
			drawLine: new bigRender.CommandInflator({}),
			drawShape: new bigRender.CommandInflator({}),
			drawImage: new bigRender.CommandInflator({})
		};
	};

	var p = CommandPrepper.prototype;


	p.prep = function(command) {
		var inflator = this.inflators[command.type];
		if(inflator) {
			inflator.inflateCommand(command);
		}
	};


	bigRender.CommandPrepper = CommandPrepper;
}());