/* globals createjs, _, jigg */
//to erase
/*
 this.ctx.globalCompositeOperation = "destination-out";
 this.ctx.strokeStyle = "rgba(0,0,0,1.0)";
 */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var LayerBitmapView = function(commandDispatcher, width, height) {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.commandDispatcher = commandDispatcher;
		this.draw = new bigRender.DrawTools(this.ctx);

		createjs.Bitmap.call(this, this.canvas); //super

		_.bindAll(this, '_doDrawImage', '_doDrawLine', '_doDrawShape', '_doEraseRect', '_doMoveRect', '_redraw');
		this._addListeners();
		this.setDimensions(width, height);
	};

	var p = LayerBitmapView.prototype = new createjs.Bitmap();


	p.setDimensions = function(width, height) {
		if(width !== this.canvas.width || height !== this.canvas.height) {
			this.canvas.width = width;
			this.canvas.height = height;
			this._redraw(null);
		}
	};


	p.clear = function() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.commandDispatcher.clear();
	};


	p.remove = function() {
		this.clear();
		this._removeListeners();
		this.canvas = null;
		this.ctx = null;
		this.commandDispatcher = null;
	};


	p._addListeners = function() {
		var c = this.commandDispatcher;
		c.addEventListener(bigRender.command.DRAW_IMAGE + 'Do', this._doDrawImage);
		c.addEventListener(bigRender.command.DRAW_IMAGE + 'Undo', this._redraw);
		c.addEventListener(bigRender.command.DRAW_LINE + 'Do', this._doDrawLine);
		c.addEventListener(bigRender.command.DRAW_LINE + 'Undo', this._redraw);
		c.addEventListener(bigRender.command.DRAW_SHAPE + 'Do', this._doDrawShape);
		c.addEventListener(bigRender.command.DRAW_SHAPE + 'Undo',this._redraw);
		c.addEventListener(bigRender.command.ERASE_RECT + 'Do', this._doEraseRect);
		c.addEventListener(bigRender.command.ERASE_RECT + 'Undo', this._redraw);
		c.addEventListener(bigRender.command.MOVE_RECT + 'Do', this._doMoveRect);
		c.addEventListener(bigRender.command.MOVE_RECT + 'Undo', this._redraw);
	};


	p._removeListeners = function() {
		var c = this.commandDispatcher;
		c.removeEventListener(bigRender.command.DRAW_IMAGE + 'Do', this._doDrawImage);
		c.removeEventListener(bigRender.command.DRAW_IMAGE + 'Undo', this._redraw);
		c.removeEventListener(bigRender.command.DRAW_LINE + 'Do', this._doDrawLine);
		c.removeEventListener(bigRender.command.DRAW_LINE + 'Undo', this._redraw);
		c.removeEventListener(bigRender.command.DRAW_SHAPE + 'Do', this._doDrawShape);
		c.removeEventListener(bigRender.command.DRAW_SHAPE + 'Undo',this._redraw);
		c.removeEventListener(bigRender.command.ERASE_RECT + 'Do', this._doEraseRect);
		c.removeEventListener(bigRender.command.ERASE_RECT + 'Undo', this._redraw);
		c.removeEventListener(bigRender.command.MOVE_RECT + 'Do', this._doMoveRect);
		c.removeEventListener(bigRender.command.MOVE_RECT + 'Undo', this._redraw);
	};


	p._doDrawImage = function(e) {
		this.draw.drawImage(e.command);
	};


	p._doStroke = function(e) {
		var brush = e.command.brush || 'line';

		if(brush === 'line') {
			this.draw.drawLineStroke(e.command);
		}
		else {
			this.draw.drawStepStroke(e.command);
		}
	};


	p._doDrawShape = function(e) {
		this.draw.drawShape(e.command);
	};


	p._doEraseRect = function(e) {
		this.draw.eraseRect(e.command);
	};


	p._doMoveRect = function(e) {
		this.draw.moveRect(e.command);
	};


	p._redraw = function(e) {
		this.clear();
		this.commandDispatcher.start();
	};


	bigRender.LayerBitmapView = LayerBitmapView;

}());