var jigg = jigg || {};

(function() {
	'use strict';

	var maths = {};

	maths.RAD_DEG = 180 / Math.PI;
	maths.DEG_RAD =  Math.PI / 180;

	maths.pythag = function(distX, distY) {
		var distTot = Math.sqrt((distX*distX)+(distY*distY));
		return(distTot);
	}

	jigg.maths = maths;

}());