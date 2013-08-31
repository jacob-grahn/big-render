/* global createjs */
var bigRender = bigRender || {};

(function(){
	'use strict';


	var CompositionView = function(model, queue) {
		createjs.Container.call(this);
	};

	var p = CompositionView.prototype = new createjs.Container();


	p.addListeners = function() {
		var c = this.commandDispatcher;
		c.addEventListener()
	};


	p.removeListeners = function() {

	};


	bigRender.CompositionView = CompositionView;
}());