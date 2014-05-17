(function() {
	"use strict";

	var socket = io.connect("http://localhost");

	socket.on("stream", function(res) {
		console.log("stream", res);
		var key = res[0];
		var data = res[1];

		$("var").filter("[data-promise='" + key + "']")
			.html(data);
	});
})();
