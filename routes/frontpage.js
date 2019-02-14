const db = require('../config/mysql')();

module.exports = function (app) {
    app.get('/', (req, res, next) => {
        db.query('SELECT * FROM cms.home', (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:15:5)`);
			res.render('front', { home: result[1] });
		});
    })
}