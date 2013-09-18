/* global createjs */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var DisplayFactory = function() {
		this.images = {};
		this.queue = new createjs.LoadQueue();
	};

	var p = DisplayFactory.prototype;


	p.add = function(img) {
		var src = img.getAttribute('src');
		this.images[src] = img;
	};


	p.make = function(src) {
		var img = this.makeImg(src);
		var bitmap = new createjs.Bitmap(img);
		return(bitmap);
	};


	p.makeImg = function(src) {
		var img = this.images[src];
		if(!img) {
			img = document.createElement('img');
			img.setAttribute('src', src);
			this.add(img);
		}
		return(img);
	};


	p.remove = function() {
		this.images = null;
	};


	bigRender.DisplayFactory = new DisplayFactory();

}());