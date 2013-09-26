var config = {
	// Generic config settings.
	name: "Skeleton",
	port: 8080,

	db: {
		adapter: "mysql",
		mysql: {
			host: "localhost",
			user: "",
			password: "",
			database: ""
		}
	},

	// Set up arbitrary environments with specific config settings.
	env: {
		production: {
			port: 80,

			db: {
				adapter: "mysql",
				mysql: {
					host: "localhost",
					user: "",
					password: "",
					database: ""
				}
			}
		},

		development: {
			// Allows use of debugging features like CS.private.
			debug: true
		}
	}
}

module.exports = config;
