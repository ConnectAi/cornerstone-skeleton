(function() {
	"use strict";

	// logging
	CS.diff = function() {
		var start = new Date(+document.getElementById('start').value);
		var end = Date.now();
		var total = end - start;

		document.getElementById('end').value = end;
		document.getElementById('total').value = total;
	};
})();
