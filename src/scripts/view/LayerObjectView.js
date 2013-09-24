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


	p.getSaveState = function() {
		var state = {};
		var commands = [];

		for(var i=0; i<this.children.length; i++) {
			var child = this.children[i];
			var command = {x: child.x, y: child.y};
			if(child.rotation !== 0) {
				command.rotation = child.rotation;
			}
			if(child.alpha !== 1) {
				command.alpha = child.alpha;
			}
			if(child.scaleX !== 1) {
				command.scaleX = child.scaleX;
			}
			if(child.scaleY !== 1) {
				command.scaleY = child.scaleY;
			}
			if(child.skewX !== 0) {
				command.skewX = child.skewX;
			}
			if(child.skewY !== 0) {
				command.skewY = child.skewY;
			}
			if(child.rawRegX !== 'center') {
				command.regX = child.rawRegX;
			}
			if(child.rawRegY !== 'center') {
				command.regY = child.rawRegY;
			}
		}

		state.commands = commands;
		return(state);
	};


	p.setSaveState = function(state) {
		this.clear();
		for(var i=0; i<state.length; i++) {
			var command = state[i];
			this.addImage(command);
		}
	};


	p.addImage = function(command) {
		var src = command.src;
		var objectId = command.id || command.objectId || this.nextObjectId++;
		var displayObject = bigRender.ImageCache.makeBitmap(src);
		displayObject.objectId = command.objectId = objectId;
		this.lookup[objectId] = displayObject;
		this.addChild(displayObject);
		this._positionObject(command, displayObject);
	};


	p.clear = function() {
		this.removeAllChildren();
		this.lookup = [];
	};


	p.remove = function() {
		this.clear();
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
		var img = bigRender.ImageCache.makeImg(e.command.src);
		if(img.width === 0) {
			e.returnStatus = 'repeat';
		}
		else {
			this.addImage(e.command);
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
		var first = bigRender.firstWithValue;
		var d = displayObject || this.lookup[command.objectId];
		if(d) {
			d.x = first(command.x, d.x);
			d.y = first(command.y, d.y);
			d.scaleX = first(command.scaleX, d.scaleX);
			d.scaleY = first(command.scaleY, d.scaleY);
			d.rotation = first(command.rotation, d.rotation);
			d.alpha = first(command.alpha, d.alpha);
			d.skewX = first(command.skewX, d.skewX);
			d.skewY = first(command.skewY, d.skewY);

			var regX = first(command.regX, command.rawRegX, d.rawRegX, 'center');
			var regY = first(command.regY, command.rawRegY, d.rawRegY, 'center');

			if(typeof regX === 'number') {
				d.regX = regX;
			}
			if(typeof regY === 'number') {
				d.regY = regY;
			}

			if(d instanceof createjs.Bitmap) {
				if(regX === 'center') {
					d.regX = d.image.width / 2;
				}
				if(regX === 'left') {
					d.regX = 0;
				}
				if(regX === 'right') {
					d.regX = d.image.width;
				}
				if(regY === 'top') {
					d.regY = 0;
				}
				if(regY === 'center') {
					d.regY = d.image.height / 2;
				}
				if(regY === 'bottom') {
					d.regY = d.image.height;
				}
			}

			d.rawRegX = regX;
			d.rawRegY = regY;
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