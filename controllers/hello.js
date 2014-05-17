module.exports = {
	// URL: /hello
	// file: /views/hello/index.html
	index(req, res) {
		res.view();
	},

	// URL: /hello/world
	// file: /views/hello/world.html
	world(req, res) {
		res.view({
			test: app.db.query("select * from user")
				.then(function(users) {
					return users.map(function(user) {
						return `<a href="mailto:${user.email}">${user.name}</a>`;
					}).join('<br>');
				})
		});
	}
};
