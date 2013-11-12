(function() {
	"use strict";

	// This is an app-wide script, included in layout.html.
	var socket = io.connect("http://localhost");

	socket.on("welcome", function(data) {
		console.log("welcome", data);
		socket.emit("my other event", { my: "data" });
	});
})();
