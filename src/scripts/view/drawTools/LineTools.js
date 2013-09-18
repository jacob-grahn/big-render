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
		var result = true;

		for(var i=0; i<path.length; i+=2) {
			nextX = path[i];
			nextY = path[i+1];
			result = this.drawLineWithSteps(curX, curY, nextX, nextY, func);
			if(!result) {
				break;
			}
			curX = nextX;
			curY = nextY;
		}

		return(result);
	};


	p.drawLineWithSteps = function(startX, startY, endX, endY, func) {
		var curX = startX,
				curY = startY,
				lastX,
				lastY,
				roundedX,
				roundedY,
				distX = endX - startX,
				distY = endY - startY,
				distTot = bigRender.Maths.pythag(distX, distY),
				distTraveled = 0,
				stepX = distX / distTot,
				stepY = distY / distTot,
				result = true;

		while(distTraveled <= distTot) {
			roundedX = Math.round(curX);
			roundedY = Math.round(curY);

			if(roundedX !== lastX || roundedY !== lastY) {
				result = func(roundedX, roundedY);
				if(!result) {
					break;
				}
			}

			lastX = roundedX;
			lastY = roundedY;
			curX += stepX;
			curY += stepY;
			distTraveled += 1;
		}

		return(result);
	};


	bigRender.LineTools = new LineTools();

}());