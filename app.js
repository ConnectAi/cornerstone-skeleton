// Place your startup code here.

if (app.config.sockets) {
	server.io.sockets.on("connection", function(socket) {
		console.info("Socket connection established.");

		socket.emit("welcome", { hello: "world" });
		socket.on("my other event", function(data) {
			log("other event", data);
		});
	});
}
