(function() {
	"use strict";

	var start = moment(+document.getElementById('start').value);
	var format = 'HH:mm:ss.SSS';

	document.getElementById('start').value = start.format(format);

	// logging
	CS.diff = function() {
		var end = moment();
		var total = end.diff(start);

		document.getElementById('end').value = end.format(format);
		document.getElementById('total').value = total + ' ms';
	};
})();
