/* global _ */

var bigRender = bigRender || {};

(function(){
	'use strict';


	var DrawTools = function(ctx) {
		this.ctx = ctx;
		_.bindAll(this, 'drawPixel');
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


	p.drawLine = function(command) {
		var brush = command.brush || 'line';
		if(brush === bigRender.brush.LINE) {
			this._drawStrokePath(command);
		}
		else if(command.brush === bigRender.brush.IMAGE) {
			this._drawStepPath(command, this.drawImage);
		}
		else if(command.brush === bigRender.brush.PIXEL) {
			this._drawStepPath(command, this.drawPixel);
		}
		else if(command.brush === bigRender.brush.SHAPE) {
			this._drawStepPath(command, this.drawShape);
		}
	};


	p._drawStrokePath = function(command) {
		var path = command.path;
		var ctx = this.ctx;
		var x;
		var y;

		this.applyCtxStyle(command, ctx);

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


	p._drawStepPath = function(command, func) {
		var path = command.path;
		var curX = path[0];
		var curY = path[1];
		var nextX = 0;
		var nextY = 0;

		for(var i=0; i<path.length; i+=2) {
			nextX = path[i];
			nextY = path[i+1];
			this._drawStepLine(curX, curY, nextX, nextY, func, command);
			curX = nextX;
			curY = nextY;
		}
	};


	p._drawStepLine = function(startX, startY, endX, endY, func, command) {
		var curX = startX;
		var curY = startY;
		var distX = endX - startX;
		var distY = endY - startY;
		var distTot = bigRender.Maths.pythag(distX, distY);
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
		this.applyCtxStyle(command);

		var shape = command.shape;
		if(shape === bigRender.shape.RECTANGLE) {
			this._drawRectangle(command);
		}
		else if(shape === bigRender.shape.ELLIPSE) {
			this._drawEllipse(command);
		}
		else if( shape === bigRender.shape.TRIANGLE ) {
			this._drawTriangle(command);
		}
		else if( shape === bigRender.shape.STAR ) {
			this._drawStar(command);
		}

		if(command.fill !== false) {
			this.ctx.fill();
		}
		if(command.stroke !== false) {
			this.ctx.stroke();
		}
	};


	p.drawPixel = function(command) {
		this.applyCtxStyle(command);
		var x = command.x;
		var y = command.y;
		var width = command.width || 1;
		var height = command.height || 1;
		this.ctx.fillRect(x, y, width, height);
	};


	p.moveRect = function(command) {
		this.applyCtxStyle(command);
		var src = command.src;
		var dest = command.dest;

		var tempImg = this._copyRect(src);
		this.drawRect(tempImg, dest.x, dest.y, dest.width, dest.height, dest.rotation, dest.scaleX, dest.scaleY);
		this.ctx.clearRect(src.x, src.y, src.width, src.height);
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


	p._drawEllipse = function(command) {
		this.ctx.beginPath();
		var x = command.x;
		var y = command.y;
		var width = command.width;
		var height = command.height;
		var hB = ( width / 2 ) * 0.5522848;
		var vB = ( height / 2 ) * 0.5522848;
		var eX = x + width;
		var eY = x + height;
		var mX = x + width / 2;
		var mY = x + height / 2;
		this.ctx.moveTo( x, mY );
		this.ctx.bezierCurveTo( x, mY - vB, mX - hB, y, mX, y );
		this.ctx.bezierCurveTo( mX + hB, y, eX, mY - vB, eX, mY );
		this.ctx.bezierCurveTo( eX, mY + vB, mX + hB, eY, mX, eY );
		this.ctx.bezierCurveTo( mX - hB, eY, x, mY + vB, x, mY );
		this.ctx.closePath();
	};


	p._drawRectangle = function(command) {
		var left = command.x;
		var right = command.x + command.width;
		var top = command.y;
		var bottom = command.y + command.height;

		this.ctx.beginPath();
		this.ctx.moveTo(left, top);
		this.ctx.lineTo(right, top);
		this.ctx.lineTo(right, bottom);
		this.ctx.lineTo(left, bottom);
		this.ctx.lineTo(left, top);
		this.ctx.closePath();
	};


	p._drawTriangle = function(command) {
		var left = command.x;
		var right = command.x + command.width;
		var top = command.y;
		var bottom = command.y + command.height;

		this.ctx.beginPath();
		this.ctx.moveTo( left, top );
		this.ctx.lineTo( right, bottom );
		this.ctx.lineTo( left, bottom );
		this.ctx.lineTo( left, top );
		this.ctx.closePath();
	};
	
	
	p._drawStar = function(command) {
		var x = command.x;
		var y = command.y;
		var width = command.width;
		var height = command.height;

		var centerX = x + ( width / 2 );
		var centerY = y + ( height / 2 );
		var spacing = Math.PI * 2 / 5;

		var diameter = Math.max( Math.abs( width ), Math.abs( height ) ) / 2;
		var scaleX = width / diameter;
		var scaleY = height / diameter;

		var hSpacing = spacing / 2;
		var pRadius = diameter / 2;
		var iRadius = pRadius / 2;

		var p1Rad = spacing * 0;
		var p2Rad = spacing * 1;
		var p3Rad = spacing * 2;
		var p4Rad = spacing * 3;
		var p5Rad = spacing * 4;
		var i1Rad = p1Rad + hSpacing;
		var i2Rad = p2Rad + hSpacing;
		var i3Rad = p3Rad + hSpacing;
		var i4Rad = p4Rad + hSpacing;
		var i5Rad = p5Rad + hSpacing;

		var p1x = Math.cos( p1Rad ) * pRadius;
		var p1y = Math.sin( p1Rad ) * pRadius;
		var p2x = Math.cos( p2Rad ) * pRadius;
		var p2y = Math.sin( p2Rad ) * pRadius;
		var p3x = Math.cos( p3Rad ) * pRadius;
		var p3y = Math.sin( p3Rad ) * pRadius;
		var p4x = Math.cos( p4Rad ) * pRadius;
		var p4y = Math.sin( p4Rad ) * pRadius;
		var p5x = Math.cos( p5Rad ) * pRadius;
		var p5y = Math.sin( p5Rad ) * pRadius;

		var i1x = Math.cos( i1Rad ) * iRadius;
		var i1y = Math.sin( i1Rad ) * iRadius;
		var i2x = Math.cos( i2Rad ) * iRadius;
		var i2y = Math.sin( i2Rad ) * iRadius;
		var i3x = Math.cos( i3Rad ) * iRadius;
		var i3y = Math.sin( i3Rad ) * iRadius;
		var i4x = Math.cos( i4Rad ) * iRadius;
		var i4y = Math.sin( i4Rad ) * iRadius;
		var i5x = Math.cos( i5Rad ) * iRadius;
		var i5y = Math.sin( i5Rad ) * iRadius;

		this.ctx.translate( centerX, centerY );
		this.ctx.scale( scaleX, scaleY );

		this.ctx.beginPath();
		this.ctx.moveTo( p1x, p1y );
		this.ctx.lineTo( i1x, i1y );
		this.ctx.lineTo( p2x, p2y );
		this.ctx.lineTo( i2x, i2y );
		this.ctx.lineTo( p3x, p3y );
		this.ctx.lineTo( i3x, i3y );
		this.ctx.lineTo( p4x, p4y );
		this.ctx.lineTo( i4x, i4y );
		this.ctx.lineTo( p5x, p5y );
		this.ctx.lineTo( i5x, i5y );
		this.ctx.lineTo( p1x, p1y );
		this.ctx.closePath();
	};


	bigRender.DrawTools = DrawTools;

}());