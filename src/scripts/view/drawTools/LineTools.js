var bigRender = bigRender || {};

(function(){
	'use strict';

	var LineTools = function() {};
	var p = LineTools.prototype;


	p.drawPathWithStrokes = function(ctx, path) {
		var x;
		var y;

		ctx.beginPath();

		for(var i=0; i<path.length; i+=2) {
			x = path[i];
			y = path[i+1];
			ctx.lineTo(x, y);
		}
		if(path.length === 2) {
			ctx.lineTo( x+0.1, y );
		}

		ctx.stroke();
	};


	p.drawPathWidthSteps = function(path, func) {
		var curX = path[0];
		var curY = path[1];
		var nextX = 0;
		var nextY = 0;

		for(var i=0; i<path.length; i+=2) {
			nextX = path[i];
			nextY = path[i+1];
			this.drawLineWithSteps(curX, curY, nextX, nextY, func);
			curX = nextX;
			curY = nextY;
		}
	};


	p.drawLineWithSteps = function(startX, startY, endX, endY, func) {
		var curX = startX;
		var curY = startY;
		var distX = endX - startX;
		var distY = endY - startY;
		var distTot = bigRender.Maths.pythag(distX, distY);
		var distTraveled = 0;
		var stepX = distX / distTot;
		var stepY = distY / distTot;

		while(distTraveled <= distTot) {
			var roundedX = Math.round(curX);
			var roundedY = Math.round(curY);
			func(roundedX, roundedY);
			curX += stepX;
			curY += stepY;
			distTraveled += 1;
		}
	};


	bigRender.LineTools = new LineTools();

}());