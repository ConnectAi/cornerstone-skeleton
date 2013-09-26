var services = app.util.loader.dirSync("services");

var routes = {
	"/"(req, res, next) {
		res.view("index");
	}
};

module.exports = routes;
