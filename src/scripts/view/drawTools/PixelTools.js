/* global Color */

/* flood fill code roughly based on tutorial here: http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/ */

var bigRender = bigRender || {};

(function(){
	'use strict';

	var PixelTools = function() {};
	var p = PixelTools.prototype;


	p.drawPixel = function(ctx, x, y, width, height) {
		width = width || 1;
		height = height || 1;
		ctx.fillRect(x, y, width, height);
		return(true);
	};


	p.getPixel = function(ctx, x, y) {
		var data = ctx.getImageData(x, y, 1, 1).data;
		var c = new Color(data[0], data[1], data[2], data[3]);
		return(c.getHex());
	};


	p.floodFill = function(canvas, params) {
		var centerX = params.x || 0,
				centerY = params.y || 0,
				width = params.width || 50,
				height = params.height || 50,
				color = params.color || params.fillStyle || '#000000',
				top = Math.round(centerY - height / 2),
				right = Math.round(centerX + width / 2),
				bottom = Math.round(centerY + height / 2),
				left = Math.round(centerX - width / 2),
				ctx = canvas.getContext('2d');

		top = bigRender.Maths.limit(top, 0, canvas.height);
		right = bigRender.Maths.limit(right, 0, canvas.width);
		bottom = bigRender.Maths.limit(bottom, 0, canvas.height);
		left = bigRender.Maths.limit(left, 0, canvas.width);
		width = right - left;
		height = bottom - top;

		if(width > 0 && height > 0 && top < centerY && right > centerX && bottom > centerY && left < centerX) {
			var imageData = ctx.getImageData(left, top, width, height);
			var rawFloodColor = this._simpleToRawColor(color);
			this.floodFillImageData({data:imageData.data, startX:centerX-left, startY:centerY-top, top:0, right:width, bottom:height, left:0, floodColor:rawFloodColor});
			ctx.putImageData(imageData, left, top);
		}
	};


	p.floodFillImageData = function (params) {
		var data = params.data,
				startX = params.startX,
				startY = params.startY,
				floodColor = params.floodColor,
				top = params.top,
				right = params.right,
				bottom = params.bottom,
				left = params.left,
				width = right - left,
				height = bottom - top,
				newPos,
				x,
				y,
				pixelPos,
				reachLeft,
				reachRight,
				pixelStack = [[startX, startY]];

		right -= 1;
		bottom -= 1;

		//get the start color
		pixelPos = (startY * width + startX) * 4;
		var startColor = [
			data[pixelPos],
			data[pixelPos+1],
			data[pixelPos+2],
			data[pixelPos+3]
		];

		while (pixelStack.length) {
			newPos = pixelStack.pop();
			x = newPos[0];
			y = newPos[1];

			// Get current pixel position
			pixelPos = (y * width + x) * 4;

			// Go up as long as the color matches and are inside the canvas
			while (y >= top && this._matchRawColor(data, pixelPos, startColor)) {
				y -= 1;
				pixelPos -= width * 4;
			}

			pixelPos += width * 4;
			y += 1;
			reachLeft = false;
			reachRight = false;

			// Go down as long as the color matches and in inside the canvas
			while (y <= bottom && this._matchRawColor(data, pixelPos, startColor)) {
				y += 1;

				this._colorRawPixel(data, pixelPos, floodColor);

				if (x > left) {
					if (this._matchRawColor(data, pixelPos-4, startColor)) {
						if (!reachLeft) {
							// Add pixel to stack
							pixelStack.push([x - 1, y]);
							reachLeft = true;
						}
					} else if (reachLeft) {
						reachLeft = false;
					}
				}

				if (x < right) {
					if (this._matchRawColor(data, pixelPos+4, startColor)) {
						if (!reachRight) {
							// Add pixel to stack
							pixelStack.push([x + 1, y]);
							reachRight = true;
						}
					} else if (reachRight) {
						reachRight = false;
					}
				}

				pixelPos += width * 4;
			}
		}
	};


	p._simpleToRawColor = function(simpleColor) {
		var color = new Color(simpleColor);
		var rawColor = [
			color._red,
			color._green,
			color._blue,
			Math.round(color._alpha * 255)
		];
		return(rawColor);
	};


	p._matchRawColor = function(data, pixelPos, rawColor) {
		return (data[pixelPos] === rawColor[0] && data[pixelPos+1] === rawColor[1] && data[pixelPos+2] === rawColor[2] && data[pixelPos+3] === rawColor[3]);
	};


	p._colorRawPixel = function (data, pixelPos, rawColor) {
		data[pixelPos] = rawColor[0];
		data[pixelPos+1] = rawColor[1];
		data[pixelPos+2] = rawColor[2];
		data[pixelPos+3] = rawColor[3];
	};


	bigRender.PixelTools = new PixelTools();

}());