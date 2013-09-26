var services = app.util.loader.dirSync("services");

var routes = {
	"/"(req, res, next) {
		req.url = "/sample";
		next();
	}
};

module.exports = routes;
