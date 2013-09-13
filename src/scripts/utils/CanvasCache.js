var bigRender = bigRender || {};

(function() {
	'use strict';


	var CanvasCache = function() {
		this.maxStorage = 100;
		this.canvases = [];
	};
	
	var p = CanvasCache.prototype;
	
	
	p.pop = function(width, height) {
		var canvas;
		if(this.canvases.length > 0) {
			canvas = this.canvases.pop();
		}
		else {
			canvas = document.createElement('canvas');
		}
		if(width && height) {
			canvas.width = width;
			canvas.height = height;
		}
		return(canvas);
	};
	
	
	p.push = function(canvas) {
		canvas.width = 0;
		canvas.height = 0;
		var ctx = canvas.getContext('2d');
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		if(this.canvases.length < this.maxStorage) {
			this.canvases.push( canvas );
		}
	};


	bigRender.CanvasCache = new CanvasCache();

}());