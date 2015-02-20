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


let tests = {
	timeout: function(variant) {
		let time;

		switch (variant) {
			case '1':
				time = 0;
				break;
			case '2':
				time = 2000;
				break;
			case '3':
				time = 10000;
				break;
		}

		return [ makeTimeout(time) ];
	}
};


module.exports = {

	"server/:test/:variant"(req, res, next, test, variant) {
		res.locals.method = 'server';

		let start = Date.now();
		let promises = tests[test](variant);

		Promise.all(promises)
		.then(function(data) {
			res.view({
				data,
				start
			});
		});
	},


	"ajax/:test/:variant"(req, res) {
		res.locals.method = 'ajax';

		let start = Date.now();

		res.view({
			start
		});
	},


	'get/:test/:variant?'(req, res, next, test, variant) {
		let promises = tests[test](variant);

		Promise.all(promises)
			.then(function(data) {
				res.json(data);
			});
	},


	"stream/:test/:variant"(req, res, next, test, variant) {
		res.locals.method = 'stream';

		let start = Date.now();
		let promises = tests[test](variant);

		res.view({
			promises,
			start
		});
	}

};
