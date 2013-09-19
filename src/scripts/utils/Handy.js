var bigRender = bigRender || {};

(function() {
	'use strict';

	bigRender.firstWithValue = function() {
		for(var i=0; i<arguments.length; i++) {
			var val = arguments[i];
			if(val !== null && typeof val !== 'undefined') {
				return(val);
			}
		}
	};

}());