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


	p.drawPathWithSteps = function(params, func) {
		var path = params.path;
		var curX = path[0];
		var curY = path[1];
		var nextX = 0;
		var nextY = 0;
		var result = true;

		for(var i=0; i<path.length; i+=2) {
			nextX = path[i];
			nextY = path[i+1];

			params.startX = curX;
			params.startY = curY;
			params.endX = nextX;
			params.endY = nextY;
			result = this.drawLineWithSteps(params, func);
			if(!result) {
				break;
			}

			curX = nextX;
			curY = nextY;
		}

		return(result);
	};


	p.drawLineWithSteps = function(params, func) {
		var startX = params.startX || 0,
				startY = params.startY || 0,
				endX = params.endX || 0,
				endY = params.endY || 0,
				stepDist = params.stepDist || 1,
				useRounding = params.useRounding || true,
				curX = startX,
				curY = startY,
				lastX,
				lastY,
				roundedX,
				roundedY,
				distX = endX - startX,
				distY = endY - startY,
				distTot = bigRender.Maths.pythag(distX, distY),
				distTraveled = 0,
				stepDistX = distX / distTot * stepDist,
				stepDistY = distY / distTot * stepDist,
				result = true;

		while(distTraveled <= distTot) {
			if(useRounding) {
				roundedX = Math.round(curX);
				roundedY = Math.round(curY);
			}
			else {
				roundedX = curX;
				roundedY = curY;
			}

			if(roundedX !== lastX || roundedY !== lastY) {
				result = func(roundedX, roundedY);
				if(!result) {
					break;
				}
			}

			lastX = roundedX;
			lastY = roundedY;
			curX += stepDistX;
			curY += stepDistY;
			distTraveled += stepDist;
		}

		return(result);
	};


	bigRender.LineTools = new LineTools();

}());