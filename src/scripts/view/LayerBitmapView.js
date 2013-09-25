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

		//super
		createjs.Bitmap.call(this, this.canvas);
		//

		_.bindAll(this, '_doDrawImageHandler', '_doDrawLineHandler', '_doDrawShapeHandler', '_doEraseRectHandler', '_doMoveRectHandler', '_doFloodFillHandler', '_redrawHandler');
		this._addListeners();
		this.setDimensions(width, height);
	};

	var p = LayerBitmapView.prototype = new createjs.Bitmap();


	p.getSaveState = function() {
		var image = this.canvas.toDataURL();
		return(image);
	};


	p.setSaveState = function(imageSrc) {
		var img = document.createElement('img');
		img.setAttribute('src', imageSrc);
		this.clear();
		this.ctx.drawImage(img, 0, 0);
	};


	p.setDimensions = function(width, height) {
		if(width !== this.canvas.width || height !== this.canvas.height) {
			this.canvas.width = width;
			this.canvas.height = height;
			this.redraw();
		}
	};


	p.redraw = function() {
		this.clear();
		this.commandDispatcher.start();
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

		c.addEventListener(bigRender.command.DRAW_IMAGE + 'Do', this._doDrawImageHandler);
		c.addEventListener(bigRender.command.DRAW_IMAGE + 'Undo', this._redrawHandler);

		c.addEventListener(bigRender.command.DRAW_LINE + 'Do', this._doDrawLineHandler);
		c.addEventListener(bigRender.command.DRAW_LINE + 'Undo', this._redrawHandler);

		c.addEventListener(bigRender.command.DRAW_SHAPE + 'Do', this._doDrawShapeHandler);
		c.addEventListener(bigRender.command.DRAW_SHAPE + 'Undo',this._redrawHandler);

		c.addEventListener(bigRender.command.ERASE_RECT + 'Do', this._doEraseRectHandler);
		c.addEventListener(bigRender.command.ERASE_RECT + 'Undo', this._redrawHandler);

		c.addEventListener(bigRender.command.MOVE_RECT + 'Do', this._doMoveRectHandler);
		c.addEventListener(bigRender.command.MOVE_RECT + 'Undo', this._redrawHandler);

		c.addEventListener(bigRender.command.FLOOD_FILL + 'Do', this._doFloodFillHandler);
		c.addEventListener(bigRender.command.FLOOD_FILL + 'Undo', this._redrawHandler);
	};


	p._removeListeners = function() {
		var c = this.commandDispatcher;

		c.removeEventListener(bigRender.command.DRAW_IMAGE + 'Do', this._doDrawImageHandler);
		c.removeEventListener(bigRender.command.DRAW_IMAGE + 'Undo', this._redrawHandler);

		c.removeEventListener(bigRender.command.DRAW_LINE + 'Do', this._doDrawLineHandler);
		c.removeEventListener(bigRender.command.DRAW_LINE + 'Undo', this._redrawHandler);

		c.removeEventListener(bigRender.command.DRAW_SHAPE + 'Do', this._doDrawShapeHandler);
		c.removeEventListener(bigRender.command.DRAW_SHAPE + 'Undo',this._redrawHandler);

		c.removeEventListener(bigRender.command.ERASE_RECT + 'Do', this._doEraseRectHandler);
		c.removeEventListener(bigRender.command.ERASE_RECT + 'Undo', this._redrawHandler);

		c.removeEventListener(bigRender.command.MOVE_RECT + 'Do', this._doMoveRectHandler);
		c.removeEventListener(bigRender.command.MOVE_RECT + 'Undo', this._redrawHandler);

		c.removeEventListener(bigRender.command.FLOOD_FILL + 'Do', this._doFloodFillHandler);
		c.removeEventListener(bigRender.command.FLOOD_FILL + 'Undo', this._redrawHandler);
	};


	p._doDrawImageHandler = function(e) {
		bigRender.ContextTools.applyStyle(this.ctx, e.command);
		bigRender.ImageTools.drawImage(this.ctx, e.command);
	};


	p._doDrawLineHandler = function(e) {
		bigRender.ContextTools.applyStyle(this.ctx, e.command);
		var result = bigRender.LineTools.drawLine(this.ctx, e.command);
		if(!result) {
			e.returnStatus = 'repeat';
		}
	};


	p._doDrawShapeHandler = function(e) {
		bigRender.ContextTools.applyStyle(this.ctx, e.command);
		bigRender.ShapeTools.drawShape(this.ctx, e.command);
	};


	p._doEraseRectHandler = function(e) {
		bigRender.ContextTools.applyStyle(this.ctx, e.command);
		bigRender.ImageTools.eraseRect(this.ctx, e.command);
	};


	p._doMoveRectHandler = function(e) {
		bigRender.ContextTools.applyStyle(this.ctx, e.command);
		bigRender.ImageTools.moveRect(this.ctx, e.command);
	};


	p._doFloodFillHandler = function(e) {
		bigRender.ContextTools.applyStyle(this.ctx, e.command);
		bigRender.PixelTools.floodFill(this.canvas, e.command);
	};


	p._redrawHandler = function(e) {
		this.redraw();
	};


	bigRender.LayerBitmapView = LayerBitmapView;

}());