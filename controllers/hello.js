module.exports = {
	// URL: /hello
	// file: /views/hello/index.html
	index(req, res) {
		res.view();
	},

	// URL: /hello/world
	// file: /views/hello/world.html
	world(req, res) {
		res.view();
	}
};
