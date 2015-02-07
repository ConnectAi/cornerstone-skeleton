var fs = require('fs');
var request = require('request');


var query = function(input) {
	return new Promise(function(resolve, reject) {
		app.db.collection('user')
			.find({ social: 'facebook' })
			.toArray(function(err, results) {
				resolve(results);
			});
	});
};

var toHTML = function(results) {
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

var read = function(input) {
	return new Promise(function(resolve, reject) {
		request('http://www.gutenberg.org/files/2701/old/moby10b.txt', function(err, response, body) {
			resolve('body');
		});
	});
};

var makeTimeout = function(n = 1000) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve(n);
		}, n);
	});
};


module.exports = {
	'get/:n?'(req, res, next, n) {
		var fn = makeTimeout;
		if (n === 'read') fn = read;
		if (n === 'query') fn = query;
		if (n === 'query:html') fn = query;

		fn(n)
			.then(function(data) {
				if (n === 'query:html') {
					data = toHTML(data);
				}
				res.json(data);
			});
	},

	ajax(req, res) {
		var start = Date.now();
		res.view({
			start
		});
	},

	server(req, res) {
		var start = Date.now();

		Promise.all([
			read('read'),
			makeTimeout(5e2),
			makeTimeout(1e1),
			makeTimeout(),
			query(),
			read(),
			makeTimeout(2e3),
			read(),
			query().then(toHTML),
		])
		.then(function([data0, data1, data2, data3, data4, data5, data6, data7, data8, data9]) {
			res.view({
				data0,
				data1,
				data2,
				data3,
				data4,
				data5,
				data6,
				data7,
				data8,
				start
			});
		});
	},

	stream(req, res) {
		var start = Date.now();

		res.view({
			data0: read(),
			data1: makeTimeout(5e2),
			data2: makeTimeout(1e1),
			data3: makeTimeout(),
			data4: query(),
			data5: read(),
			data6: makeTimeout(2e3),
			data7: read(),
			data8: query().then(toHTML),
			start
		});
	}
};
