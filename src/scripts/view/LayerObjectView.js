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
		var displayObject = command.displayObject;
		var objectId = displayObject.objectId || command.objectId || this.nextObjectId++;
		displayObject.objectId = e.command.objectId = objectId;

		this.lookup[objectId] = displayObject;
		this.addChild(displayObject);
		this._positionObject(e.command, displayObject);
	};


	p._undoAddObjectHandler = function() {};


	p._doMoveObjectHandler = function() {};


	p._undoMoveObjectHandler = function() {};


	p._doRemoveObjectHandler = function() {};


	p._undoRemoveObjectHandler = function() {};


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
		}
	};



	bigRender.LayerObjectView = LayerObjectView;

}());