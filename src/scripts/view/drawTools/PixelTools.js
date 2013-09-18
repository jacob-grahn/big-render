/* global Color */

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


	p.floodFill = function(ctx, startX, startY, width, height) {
		width = width || 50;
		height = height || 50;
		var left = Math.round(startX - width / 2);
		var top = Math.round(startY - height / 2);
		var imageData = ctx.getImageData(left, top, width, height);
	};


	p.doFloodFill = function (imageData, startX, startY, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight, startColor, floodColor) {
		var newPos,
			x,
			y,
			pixelPos,
			reachLeft,
			reachRight,
			drawingBoundLeft = drawingAreaX,
			drawingBoundTop = drawingAreaY,
			drawingBoundRight = drawingAreaX + drawingAreaWidth - 1,
			drawingBoundBottom = drawingAreaY + drawingAreaHeight - 1,
			pixelStack = [[startX, startY]];

		while (pixelStack.length) {

			newPos = pixelStack.pop();
			x = newPos[0];
			y = newPos[1];

			// Get current pixel position
			pixelPos = (y * drawingAreaWidth + x) * 4;

			// Go up as long as the color matches and are inside the canvas
			while (y >= drawingBoundTop && this.matchColor(imageData, pixelPos, startColor)) {
				y -= 1;
				pixelPos -= drawingAreaWidth * 4;
			}

			pixelPos += drawingAreaWidth * 4;
			y += 1;
			reachLeft = false;
			reachRight = false;

			// Go down as long as the color matches and in inside the canvas
			while (y <= drawingBoundBottom && this.matchColor(imageData, pixelPos, startColor)) {
				y += 1;

				this.colorPixel(imageData, pixelPos, floodColor);

				if (x > drawingBoundLeft) {
					if (this.matchColor(imageData, pixelPos-4, startColor)) {
						if (!reachLeft) {
							// Add pixel to stack
							pixelStack.push([x - 1, y]);
							reachLeft = true;
						}
					} else if (reachLeft) {
						reachLeft = false;
					}
				}

				if (x < drawingBoundRight) {
					if (this.matchColor(imageData, pixelPos+4, startColor)) {
						if (!reachRight) {
							// Add pixel to stack
							pixelStack.push([x + 1, y]);
							reachRight = true;
						}
					} else if (reachRight) {
						reachRight = false;
					}
				}

				pixelPos += drawingAreaWidth * 4;
			}
		}
	};


	p.matchColor = function(imageData, pixelPos, startColor) {
		var r = imageData[pixelPos];
		var g = imageData[pixelPos+1];
		var b = imageData[pixelPos+2];
		var a = imageData[pixelPos+3];
		return (r === startColor._red && g === startColor._green && b === startColor._blue && a === Math.round(startColor._alpha*255));
	};

	p.colorPixel = function (imageData, pixelPos, fillColor){
		imageData[pixelPos] = fillColor._red;
		imageData[pixelPos+1] = fillColor._green;
		imageData[pixelPos+2] = fillColor._blue;
		imageData[pixelPos+3] = Math.round(fillColor._alpha * 255);
	};


	bigRender.PixelTools = new PixelTools();

}());