let fs = require('fs');
let request = require('request');


let query = function(input) {
	return new Promise(function(resolve, reject) {
		app.db.collection('user')
			.find({ social: 'facebook' })
			.toArray(function(err, results) {
				resolve(results);
			});
	});
};

let toHTML = function(results) {
	return results.map(function(item) {
		return `
			<li>
				${item.firstName} ${item.lastName}
				<dl>
					<dt>username:</dt>
					<dd>${item.username}</dd>

					<dt>email:</dt>
					<dd>${item.email}</dd>
				</dl>
			</li>
		`;
	}).join('<br>');
};

let read = function(input) {
	return new Promise(function(resolve, reject) {
		request('http://www.gutenberg.org/files/2701/old/moby10b.txt', function(err, response, body) {
			resolve('body');
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
		run: function(variant) {
			return [ Promise.resolve('base') ];
		}
	},

	timeout: {
		variants: 9,
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

	":method/:scenario/:variant/:index?"(req, res, next, method, scenario, variant, index) {
		let scenario = scenarios[scenario];

		res.locals.start = Date.now();
		res.locals.method = method;
		res.locals.scenarios = Object.keys(scenarios);
		res.locals.variants = scenario.variants + 1;

		res.state = {
			promises: scenario.run(variant),
		};

		next();
	},

	"server/:scenario/:variant"(req, res, next, scenario, variant) {
		let promises = res.state.promises;

		Promise.all(promises)
		.then(function(data) {
			res.view({
				data,
			});
		});
	},


	"ajax/:scenario/:variant"(req, res, next, scenario, variant) {
		let promises = res.state.promises;

		res.view({
			numRequests: promises.length,
		});
	},


	'get/:scenario/:variant/:index'(req, res, next, scenario, variant, index) {
		let promises = res.state.promises;

		promises[index]
			.then(function(data) {
				res.json(data);
			});
	},


	"stream/:scenario/:variant"(req, res, next, scenario, variant) {
		let promises = res.state.promises;

		res.view({
			promises,
		});
	}

};
