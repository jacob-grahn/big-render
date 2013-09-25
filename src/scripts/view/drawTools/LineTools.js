var bigRender = bigRender || {};

(function(){
	'use strict';

	var LineTools = function() {};
	var p = LineTools.prototype;


	p.drawLine = function(ctx, command) {
		var brush = command.brush || 'line';
		var result = true;

		if(brush === bigRender.brush.LINE) {
			this.drawPathWithStrokes(ctx, command.path);
		}
		else {
			result = this.drawPathWithSteps(ctx, command);
		}

		return(result);
	};


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


	p.drawPathWithSteps = function(ctx, params) {
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
			result = this.drawLineWithSteps(ctx, params);
			if(!result) {
				break;
			}

			curX = nextX;
			curY = nextY;
		}

		return(result);
	};


	p.drawLineWithSteps = function(ctx, params) {
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
				result = this.drawStep(roundedX, roundedY, ctx, params);
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


	p.drawStep = function(x, y, ctx, command) {
		var result;

		bigRender.ContextTools.applyStyle(ctx, command);

		if(command.brush === bigRender.brush.IMAGE) {
			command.image.translateX = x;
			command.image.translateY = y;
			bigRender.ContextTools.appendStyle(ctx, command.image);
			result = bigRender.ImageTools.drawImage(ctx, command.image);
		}

		else if(command.brush === bigRender.brush.PIXEL) {
			result = bigRender.PixelTools.drawPixel(ctx, x, y, command.width, command.height)
		}

		else if(command.brush === bigRender.brush.SHAPE) {
			command.shape.translateX = x;
			command.shape.translateY = y;
			bigRender.ContextTools.appendStyle(ctx, command.shape);
			result = bigRender.ShapeTools.drawShape(ctx, command.shape);
		}

		return(result);
	};


	bigRender.LineTools = new LineTools();

}());