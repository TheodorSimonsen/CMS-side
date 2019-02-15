const db = require('../config/mysql')();
const fs = require('fs');

module.exports = function (app) {
	app.get('/produkt', (req, res, next) => {
		db.query('SELECT * FROM cms.home', (err, result) => {
			db.query('SELECT * FROM cms.products', (err, beta) => {
				if (err) return next(`${err} at db.query (${__filename}:15:5)`);
				res.render('products', {
					title: 'Profil',
					home: result[0],
					products: beta
				});

			});
		});
	});
}