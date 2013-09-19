/* global createjs */

var bigRender = bigRender || {};

(function() {
	'use strict';


	var LayerObjectView = function(commandDispatcher) {
		//super
		createjs.Container.call(this);
		//
		this.commandDispatcher = commandDispatcher;
		this.lookup = [];
		_.bindAll(this, '_doAddObjectHandler', '_undoAddObjectHandler', '_doMoveObjectHandler', '_undoMoveObjectHandler', '_doRemoveObjectHandler', '_undoRemoveObjectHandler');
		this._addListeners();
	};

	var p = LayerObjectView.prototype = new createjs.Container();
	p.nextObjectId = 1;


	p.remove = function() {
		this._removeListeners();
	};


	p._addListeners = function() {
		var c = this.commandDispatcher;
		c.addEventListener(bigRender.command.ADD_OBJECT + 'Do', this._doAddObjectHandler);
		c.addEventListener(bigRender.command.ADD_OBJECT + 'Undo', this._undoAddObjectHandler);
		c.addEventListener(bigRender.command.MOVE_OBJECT + 'Do', this._doMoveObjectHandler);
		c.addEventListener(bigRender.command.MOVE_OBJECT + 'Undo', this._undoMoveObjectHandler);
		c.addEventListener(bigRender.command.REMOVE_OBJECT + 'Do', this._doRemoveObjectHandler);
		c.addEventListener(bigRender.command.REMOVE_OBJECT + 'Undo', this._undoRemoveObjectHandler);
	};


	p._removeListeners = function() {
		var c = this.commandDispatcher;
		c.removeEventListener(bigRender.command.ADD_OBJECT + 'Do', this._doAddObjectHandler);
		c.removeEventListener(bigRender.command.ADD_OBJECT + 'Undo', this._undoAddObjectHandler);
		c.removeEventListener(bigRender.command.MOVE_OBJECT + 'Do', this._doMoveObjectHandler);
		c.removeEventListener(bigRender.command.MOVE_OBJECT + 'Undo', this._undoMoveObjectHandler);
		c.removeEventListener(bigRender.command.REMOVE_OBJECT + 'Do', this._doRemoveObjectHandler);
		c.removeEventListener(bigRender.command.REMOVE_OBJECT + 'Undo', this._undoRemoveObjectHandler);
	};


	p._doAddObjectHandler = function(e) {
		var command = e.command;
		var src = command.src;
		var objectId = command.id || command.objectId || this.nextObjectId++;
		var displayObject = bigRender.ImageCache.makeBitmap(src);

		if(displayObject.image.width === 0) {
			e.returnStatus = 'repeat';
		}
		else {
			displayObject.objectId = command.objectId = objectId;
			this.lookup[objectId] = displayObject;
			this.addChild(displayObject);
			this._positionObject(command, displayObject);
		}
	};


	p._undoAddObjectHandler = function(e) {
		var displayObject = this.lookup[e.command.objectId];
		if(displayObject) {
			this.removeChild(displayObject);
			delete this.lookup[e.command.objectId];
		}
	};


	p._doMoveObjectHandler = function(e) {
		var displayObject = this.lookup[e.command.objectId];
		if(displayObject) {
			e.command.restore = this._copyObjectPosition(displayObject);
			this._positionObject(e.command, displayObject);
		}
	};


	p._undoMoveObjectHandler = function(e) {
		var displayObject = this.lookup[e.command.objectId];
		if(displayObject) {
			this._positionObject(e.command.restore, displayObject);
		}
	};


	p._doRemoveObjectHandler = function(e) {
		var displayObject = this.lookup[e.command.objectId];
		if(displayObject) {
			this.removeChild(displayObject);
		}
	};


	p._undoRemoveObjectHandler = function(e) {
		var displayObject = this.lookup[e.command.objectId];
		if(displayObject) {
			this.addChild(displayObject);
		}
	};


	p._positionObject = function(command, displayObject) {
		var d = displayObject || this.lookup[command.objectId];
		if(d) {
			d.x = command.x || d.x;
			d.y = command.y || d.y;
			d.scaleX = command.scaleX || d.scaleX;
			d.scaleY = command.scaleY || d.scaleY;
			d.rotation = command.rotation || d.rotation;
			d.alpha = command.alpha || d.alpha;
			d.skewX = command.skewX || d.skewX;
			d.skewY = command.skewY || d.skewY;

			if(typeof command.regX !== 'undefined' && d instanceof createjs.Bitmap) {
				var regX = command.regX || d.regX || 'center';
				if(regX === 'center') {
					d.regX = d.image.width / 2;
				}
				if(regX === 'left') {
					d.regX = 0;
				}
				if(regX === 'right') {
					d.regX = d.image.width;
				}
				if(typeof regX === 'number') {
					d.regX = regX;
				}
			}

			if(typeof command.regY !== 'undefined' && d instanceof createjs.Bitmap) {
				var regY = command.regY || d.regY || 'center';
				if(regY === 'top') {
					d.regY = 0;
				}
				if(regY === 'center') {
					d.regY = d.image.height / 2;
				}
				if(regY === 'bottom') {
					d.regY = d.image.height;
				}
				if(typeof regY === 'number') {
					d.regY = regY;
				}
			}
		}
	};


	p._copyObjectPosition = function(object) {
		var ret = {};
		ret.x = object.x;
		ret.y = object.y;
		ret.scaleX = object.scaleX;
		ret.scaleY = object.scaleY;
		ret.rotation = object.rotation;
		ret.alpha = object.alpha;
		ret.skewX = object.skewX;
		ret.skewY = object.skewY;
		return(ret);
	};



	bigRender.LayerObjectView = LayerObjectView;

}());