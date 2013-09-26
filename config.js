var config = {
	name: "Skeleton",
	port: 8080,

	db: {
		adapter: "mysql",
		mysql: {
			host: "localhost",
			user: "root",
			password: "root",
			database: "someAwesomeDB"
		}
	},

	env: {
		production: {
			port: 80,

			db: {
				adapter: "mysql",
				mysql: {
					host: "localhost",
					user: "awesome",
					password: "shhItIsASecret",
					database: "someAwesomeDB"
				}
			}
		},

		development: {
			debug: true
		}
	}
}

module.exports = config;
