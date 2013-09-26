module.exports = {
	// URL: /sample
	index(req, res) {
		res.view();
	},

	// URL: /sample/something
	something(req, res) {
		res.view();
	}
};
