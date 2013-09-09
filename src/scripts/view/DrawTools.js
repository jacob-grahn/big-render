var bigRender = bigRender || {};

(function(){
	'use strict';


	var DrawTools = function(ctx) {
		this.ctx = ctx;
	};

	var p = DrawTools.prototype;


	p.applyCtxStyle = function(command, ctx) {
		command = command || {};
		ctx = ctx || this.ctx;

		ctx.setTransform(1, 0, 0, 1, 0, 0);

		ctx.lineCap = command.lineCap || 'round';
		ctx.lineJoin = command.lineJoin || 'round';
		ctx.lineWidth = command.lineWidth || 3;
		ctx.globalAlpha = command.globalAlpha || 1;
		ctx.strokeStyle = command.strokeStyle || '#000000';
		ctx.globalCompositeOperation = command.globalCompositeOperation || "source-over";
	};


	p.drawLineStroke = function(command) {
		var path = command.path;
		var ctx = this.ctx;

		this.applyCtxStyle(command, ctx);
		ctx.beginPath();

		for(var i=0; i<path.length; i+=2) {
			var x = path[i];
			var y = path[i+1];
			ctx.lineTo(x, y);
		}
		if(path.length === 2) {
			ctx.lineTo( x+.1, y );
		}

		ctx.stroke();
	};


	p.drawStepStroke = function(command) {
		var path = command.path;
		var curX = path[0];
		var curY = path[1];
		var nextX = 0;
		var nextY = 0;
		var func;

		if(command.brush === bigRender.brush.IMAGE) {
			func = this.drawImage;
		}
		else if(command.brush === bigRender.brush.PIXEL) {
			func = this.drawRect;
		}
		else if(command.brush === bigRender.brush.SHAPE) {
			func = this.drawShape;
		}

		for(var i=0; i<path.length; i+=2) {
			nextX = path[i];
			nextY = path[i+1];
			this.stepThroughLine(curX, curY, nextX, nextY, func, command);
			curX = nextX;
			curY = nextY;
		}
	};


	p.stepThroughLine = function(startX, startY, endX, endY, func, command) {
		var curX = startX;
		var curY = startY;
		var distX = endX - startX;
		var distY = endY - startY;
		var distTot = jigg.maths.pythag(distX, distY);
		var distTraveled = 0;
		var stepX = distX / distTot;
		var stepY = distY / distTot;
		while(distTraveled <= distTot) {
			command.x = Math.round(curX);
			command.y = Math.round(curY);
			func(command);
			curX += stepX;
			curY += stepY;
			distTraveled += 1;
		}
	};


	p.drawImage = function(command) {
		var image = command.image;
		var srcX = command.srcX || 0;
		var srcY = command.srcY || 0;
		var srcWidth = command.srcWidth || image.width;
		var srcHeight = command.srcHeight || image.height;
		var destX = command.destX || 0;
		var destY = command.destY || 0;
		var destWidth = command.destWidth || image.width;
		var destHeight = command.destHeight || image.width;
		var rotation = command.rotation || 0;
		var scaleX = command.scaleX || 1;
		var scaleY = command.scaleY || 1;

		this.applyCtxStyle(command);
		this.ctx.translate(destX, destY);
		this.ctx.rotate(rotation * jigg.maths.DEG_RAD);
		this.ctx.scale(scaleX, scaleY);

		this.ctx.drawImage(command.image, srcX, srcY, srcWidth, srcHeight, 0, 0, destWidth, destHeight);
	};


	p.drawShape = function(command) {

	};


	p.drawEllipse = function(command) {

	};


	p.drawRect = function(command) {
		this.applyCtxStyle(command);
		var x = command.x;
		var y = command.y;
		var width = command.width || 1;
		var height = command.height || 1;
		this.ctx.fillRect(x, y, width, height);
	};


	bigRender.DrawTools = DrawTools;

}());