var bigRender = bigRender || {};

(function() {
	'use strict';


	var CappedStorage = function(maxItems) {
		this.items = [];
		this.maxItems = maxItems || 10;
	};

	var p = CappedStorage.prototype;


	p.store = function(key, item) {
		var time = +new Date();
		var obj = {key:key, item: item, time: time};
		this.items.push(obj);
		this.forget();
	};


	p.retrieve = function(key) {
		for(var i=0; i<this.items.length; i++) {
			var obj = this.items[i];
			if(obj.key === key) {
				return(obj.item);
			}
		}
	};


	p.forget = function() {
		while(this.items.length > this.maxItems) {
			this.items.shift();
		}
	};


	p.clear = function() {
		this.items = [];
	};


	bigRender.CappedStorage = CappedStorage;

}());