const db = require('../config/mysql')();
const fs = require('fs');

module.exports = function (app) {
	app.get('/contentpage', (req, res, next) => {
		db.query('SELECT * FROM cms.home', (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:15:5)`);
			res.render('contentpage', { title: 'Profil', home: result[0] });
		});
	});
}