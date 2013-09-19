/* global _ */

var bigRender = bigRender || {};

(function(){
	'use strict';


	var DrawTools = function(ctx) {
		this.ctx = ctx;
	};

	var p = DrawTools.prototype;


	p.applyCtxStyle = function(command, ctx) {
		var first = bigRender.firstWithValue;
		command = command || {};
		ctx = ctx || this.ctx;

		ctx.setTransform(1, 0, 0, 1, 0, 0);

		var rotation = command.rotation || 0;
		var scaleX = command.scaleX || 1;
		var scaleY = command.scaleY || 1;
		var translateX = command.translateX || 0;
		var translateY = command.translateY || 0;

		ctx.translate(translateX, translateY);
		ctx.rotate(rotation * bigRender.Maths.DEG_RAD);
		ctx.scale(scaleX, scaleY);

		ctx.lineCap = command.lineCap || 'round';
		ctx.lineJoin = command.lineJoin || 'round';
		ctx.lineWidth = command.lineWidth || 3;
		ctx.globalAlpha = command.globalAlpha || 1;
		ctx.strokeStyle = command.strokeStyle || '#000000';
		ctx.fillStyle = command.fillStyle || '#000000';
		ctx.globalCompositeOperation = command.globalCompositeOperation || 'source-over';
	};


	p.drawLine = function(command) {
		this.applyCtxStyle(command);
		var brush = command.brush || 'line';
		var LineTools = bigRender.LineTools;
		var self = this;
		var result = true;

		if(brush === bigRender.brush.LINE) {
			LineTools.drawPathWithStrokes(this.ctx, command.path);
		}

		else if(command.brush === bigRender.brush.IMAGE) {
			result = LineTools.drawPathWithSteps(command, function(x, y) {
				command.translateX = x;
				command.translateY = y;
				return(self.drawImage(command));
			});
		}

		else if(command.brush === bigRender.brush.PIXEL) {
			result = LineTools.drawPathWithSteps(command, function(x, y) {
				return(bigRender.PixelTools.drawPixel(self.ctx, x, y, command.width, command.height));
			});
		}

		else if(command.brush === bigRender.brush.SHAPE) {
			result = LineTools.drawPathWithSteps(command, function(x, y) {
				command.x = x;
				command.y = y;
				return(self.drawShape(command));
			});
		}

		return(result);
	};


	p.drawImage = function(command) {
		this.applyCtxStyle(command);

		var tintColor = command.color || command.tintColor || '#FFFFFF';
		var tintPerc = command.tintPerc || 0;
		var image = bigRender.ImageCache.makeTintedImg(command.src, tintColor, tintPerc);
		var srcX = command.srcX || 0;
		var srcY = command.srcY || 0;
		var srcWidth = command.srcWidth || image.width;
		var srcHeight = command.srcHeight || image.height;
		var destX = command.destX || -(image.width/2);
		var destY = command.destY || -(image.height/2);
		var destWidth = command.destWidth || image.width;
		var destHeight = command.destHeight || image.width;

		if(image.width === 0 && image.height === 0) {
			return(false);
		}
		else {
			this.ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight);
			return(true);
		}
	};


	p.drawShape = function(command) {
		this.applyCtxStyle(command);

		bigRender.ShapeTools.drawShape(this.ctx, command);

		if(command.fill !== false) {
			this.ctx.fill();
		}
		if(command.stroke !== false) {
			this.ctx.stroke();
		}

		return(true);
	};


	p.moveRect = function(command) {
		this.applyCtxStyle(command);
		var src = command.src;
		var dest = command.dest;

		var tempImg = this._copyRect(src);
		this.drawRect(tempImg, dest.x, dest.y, dest.width, dest.height, dest.rotation, dest.scaleX, dest.scaleY);
		this.ctx.clearRect(src.x, src.y, src.width, src.height);
	};


	p.floodFill = function(command) {
		this.applyCtxStyle(command);

	};


	p._copyRect = function(rect) {
		var x = rect.x;
		var y = rect.y;
		var width = rect.width;
		var height = rect.height;
		var Maths = bigRender.Maths;

		/*if( x > this.width || y > this.height || x + width < 0 || y + height < 0) {
			throw new Error('ArtLayer::copyRect - invalid area');
		}*/

		x = Maths.limit(x, 0, this.width);
		y = Maths.limit(y, 0, this.height);
		width = Maths.limit(width, 1, this.width - x);
		height = Maths.limit(height, 1, this.height - y);

		var destCanvas = CanvasStore.checkout();
		destCanvas.width = width;
		destCanvas.height = height;

		var destCtx = destCanvas.getContext('2d');
		destCtx.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
	};


	p.deleteRect = function(command) {
		var rect = command.rect;
		this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
	};


	bigRender.DrawTools = DrawTools;

}());