var bigRender = bigRender || {};

(function() {
	'use strict';


	var LayerObjectView = function(commandDispatcher) {
		createjs.Container.call(this); //super
		this.commandDispatcher = commandDispatcher;
		this._addListeners();
	};

	var p = LayerObjectView.prototype = new createjs.Container();


	p.remove = function() {
		this._removeListeners();
	};


	p._addListeners = function() {
		var c = this.commandDispatcher;
		c.addEventListener(bigRender.command.ADD_OBJECT + 'Do', this._doAddObject);
		c.addEventListener(bigRender.command.ADD_OBJECT + 'Undo', this._undoAddObject);
		c.addEventListener(bigRender.command.MOVE_OBJECT + 'Do', this._doMoveObject);
		c.addEventListener(bigRender.command.MOVE_OBJECT + 'Undo', this._undoMoveObject);
		c.addEventListener(bigRender.command.REMOVE_OBJECT + 'Do', this._doRemoveObject);
		c.addEventListener(bigRender.command.REMOVE_OBJECT + 'Undo', this._undoRemoveObject);
	};


	p._removeListeners = function() {
		var c = this.commandDispatcher;
		c.removeEventListener(bigRender.command.ADD_OBJECT + 'Do', this._doAddObject);
		c.removeEventListener(bigRender.command.ADD_OBJECT + 'Undo', this._undoAddObject);
		c.removeEventListener(bigRender.command.MOVE_OBJECT + 'Do', this._doMoveObject);
		c.removeEventListener(bigRender.command.MOVE_OBJECT + 'Undo', this._undoMoveObject);
		c.removeEventListener(bigRender.command.REMOVE_OBJECT + 'Do', this._doRemoveObject);
		c.removeEventListener(bigRender.command.REMOVE_OBJECT + 'Undo', this._undoRemoveObject);
	};


	p._doAddObject = function() {};


	p._undoAddObject = function() {};


	p._doMoveObject = function() {};


	p._undoMoveObject = function() {};


	p._doRemoveObject = function() {};


	p._undoRemoveObject = function() {};



	bigRender.LayerObjectView = LayerObjectView;

}());