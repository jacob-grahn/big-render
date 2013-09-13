var bigRender = bigRender || {};

(function() {
	'use strict';

	var Maths = {};

	Maths.RAD_DEG = 180 / Math.PI;
	Maths.DEG_RAD =  Math.PI / 180;


	Maths.pythag = function(distX, distY) {
		var distTot = Math.sqrt((distX*distX)+(distY*distY));
		return(distTot);
	};


	Maths.limit = function(num, min, max) {
		if(num < min) {
			num = min;
		}
		if(num > max) {
			num = max;
		}
		return(num);
	};

	bigRender.Maths = Maths;

}());