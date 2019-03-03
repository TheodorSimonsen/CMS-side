const db = require('../config/mysql')();
const fs = require('fs');

module.exports = (app) => {
    app.get('/produkt/:id', (req, res, next) => {
        db.query('SELECT * FROM cms.home', (err, result) => {
            db.query('SELECT * FROM cms.products WHERE products.id = ?',[req.params.id], (err, beta) => {
                if (err) return next(`${err} at db.query (${__filename}:15:5)`);
                res.render('singleproduct', {
                    title: 'Profil',
                    home: result[0],
                    products: beta
                });

            });
        });
    })
}