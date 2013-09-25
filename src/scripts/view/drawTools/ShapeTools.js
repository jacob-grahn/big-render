/* global createjs */

var bigRender = bigRender || {};

(function(){
	'use strict';

	var ShapeTools = function(){};
	var p = ShapeTools.prototype;

	p.graphics = new createjs.Graphics();


	p.drawShape = function(ctx, command) {
		bigRender.ShapeTools.drawShapePath(ctx, command);

		if(command.fill !== false) {
			ctx.fill();
		}
		if(command.stroke !== false) {
			ctx.stroke();
		}

		return(true);
	};


	p.drawShapePath = function(ctx, command) {
		var shape = command.shape || bigRender.shape.RECTANGLE;

		this.graphics.clear();

		if(shape === bigRender.shape.CIRCLE) {
			this._makeCirclePath(command);
		}
		if(shape === bigRender.shape.ELLIPSE) {
			this._makeEllipsePath(command);
		}
		if(shape === bigRender.shape.RECTANGLE) {
			this._makeRectanglePath(command);
		}
		if(shape === bigRender.shape.ROUND_RECTANGLE) {
			this._makeRoundRectPath(command);
		}
		if(shape === bigRender.shape.STAR) {
			this._makeStarPath(command);
		}
		if(shape === bigRender.shape.POLYGON) {
			this._makePolygonPath(command);
		}

		this.graphics.drawAsPath(ctx);
	};


	p._makeCirclePath = function(command) {
		var x = command.x || 0,
				y = command.y || 0,
				radius = command.radius || 10;

		this.graphics.drawCircle(x, y, radius);
	};


	p._makeEllipsePath = function(command) {
		var x = command.x || 0,
				y = command.y || 0,
				w = command.width || command.w || 10,
				h = command.height || command.h || 10;

		this.graphics.drawEllipse(x, y, w, h);
	};


	p._makeRectanglePath = function(command) {
		var x = command.x || 0,
				y = command.y || 0,
				w = command.width || command.w || 10,
				h = command.height || command.h || 10;
		x -= w / 2;
		y -= h / 2;

		this.graphics.rect(x, y, w, h);
	};


	p._makeRoundRectPath = function(command) {
		var x = command.x || 0,
				y = command.y || 0,
				w = command.width || command.w || 10,
				h = command.height || command.h || 10,
				radius = command.radius || 3;
		x -= w / 2;
		y -= h / 2;

		this.graphics.drawRoundRect(x, y, w, h, radius);
	};


	p._makeStarPath = function(command) {
		var x = command.x || 0,
			y = command.y || 0,
			radius = command.radius || 10,
			sides = command.sides || 5,
			pointSize = command.pointSize || 2,
			angle = command.angle || 0;

		this.graphics.drawPolyStar(x, y, radius, sides, pointSize, angle);
	};


	p._makePolygonPath = function(command) {
		var x = command.x || 0,
			y = command.y || 0,
			radius = command.radius || 10,
			sides = command.sides || 3,
			pointSize = 0,
			angle = command.angle || 0;

		this.graphics.drawPolyStar(x, y, radius, sides, pointSize, angle);
	};


	bigRender.ShapeTools = new ShapeTools();

}());