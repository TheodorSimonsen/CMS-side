const db = require('../config/mysql')();
const fs = require('fs');

module.exports = (app) => {
    app.use('/shopping-cart', (req, res, next) => {
        if (!req.session.user) {
            res.redirect('/login');
            return;
        } else {
            next();
        }
    });

    app.get('/shopping-cart', (req, res, next) =>{
        res.render('shopping-cart');
    });

    app.get('/add-to-cart/:id', (req, res, next) => {
        window.sessionStorage()
        [req.params.id]
    });
};