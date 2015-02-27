let fs = require('fs');
let request = require('request');
let shell = require('shelljs');


let query = function(collection) {
	return new Promise(function(resolve, reject) {
		app.db.collection(collection)
			.find()
			.toArray(function(err, results) {
				resolve(results);
			});
	});
};

let read = function() {
	return new Promise(function(resolve, reject) {
		request('http://www.gutenberg.org/files/2701/old/moby10b.txt', function(err, response, body) {
			resolve('body');
		});
	});
};

let readFile = function(file) {
	return new Promise(function(resolve, reject) {
		fs.readFile(`/tmp/thesis/${file}`, function(err, data) {
			if (err) return reject(err);
			resolve(data);
		});
	});
};

let readRemoteFile = function(file) {
	let tmpPath = '/tmp/thesis';
	let localPath = '/tmp/thesis/remote';
	let filePath = `${localPath}/${file}`;

	return new Promise(function(resolve, reject) {
		shell.rm(filePath);

		shell.exec(`scp ross@${app.config.thesis.scp}:${tmpPath}/${file} ${localPath}`, function() {
			resolve(readFile(file));
		});
	});
};

let makeTimeout = function(n = 1000) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve(n);
		}, n);
	});
};


let scenarios = {

	base: {
		variants: 1,
		promises: 1,
		run: function(variant) {
			return [ Promise.resolve('base') ];
		}
	},

	'local-file': {
		variants: 4,
		promises: 1,
		run: function(variant) {
			return [ readFile(`file-${variant}`) ];
		}
	},

	'remote-file': {
		variants: 4,
		promises: 1,
		run: function(variant) {
			return [ readRemoteFile(`file-${variant}`) ];
		}
	},

	'local-database': {
		variants: 10,
		promises: 1,
		run: function(variant) {
			let collection = `test-${variant}`;
			return [ query(collection) ];
		}
	},

	'remote-database': {
		variants: 10,
		promises: 1,
		run: function(variant) {
			let collection = `test-${variant}`;
			return [ query(collection) ];
		}
	},

	'local-endpoint': {
		variants: 3,
		promises: 1,
		run: function(variant) {
			return [];
		}
	},

	'remote-endpoint': {
		variants: 3,
		promises: 1,
		run: function(variant) {
			return [];
		}
	},

	timeout: {
		variants: 9,
		promises: 1,
		run: function(variant) {
			let time;

			switch (variant) {
				case '1':
					time = 0;
					break;
				case '2':
					time = 2000;
					break;
				case '3':
					time = 4000;
					break;
				case '4':
					time = 6000;
					break;
				case '5':
					time = 8000;
					break;
				case '6':
					time = 10000;
					break;
				case '7':
					time = 20000;
					break;
				case '8':
					time = 40000;
					break;
				case '9':
					time = 60000;
					break;
			}

			return [ makeTimeout(time) ];
		}
	}

};


module.exports = {

	"endpoint"(req, res) {

	},

	":method/:scenario/:variant/:index?"(req, res, next, method, scenario, variant, index) {
		scenario = scenarios[scenario];

		res.locals.start = Date.now();
		res.locals.method = method;
		res.locals.scenarios = Object.keys(scenarios);
		res.locals.variants = scenario.variants + 1;

		res.state = {
			scenario
		};

		next();
	},

	"server/:scenario/:variant"(req, res, next, scenario, variant) {
		let promises = res.state.scenario.run(variant);

		Promise.all(promises)
		.then(function(data) {
			res.view({
				data,
			});
		});
	},


	"ajax/:scenario/:variant"(req, res, next, scenario, variant) {
		res.view({
			numRequests: res.state.scenario.promises,
		});
	},


	'get/:scenario/:variant/:index'(req, res, next, scenario, variant, index) {
		let promises = res.state.scenario.run(variant);

		promises[index]
			.then(function(data) {
				res.json(data);
			});
	},


	"stream/:scenario/:variant"(req, res, next, scenario, variant) {
		let promises = res.state.scenario.run(variant);

		res.view({
			promises
		});
	}

};
