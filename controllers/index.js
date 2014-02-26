var routes = {
	"/"(req, res, next) {
		// Render the view found at /views/index.html.
		res.view("index");
	}
};

module.exports = routes;
