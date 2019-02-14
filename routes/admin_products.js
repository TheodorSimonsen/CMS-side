const db = require('../config/mysql')();
const fs = require('fs');

module.exports = (app) => {
    app.use('/admin', (req, res, next) => {
        if (!req.session.user) {
            res.redirect('/login');
            return;
        } else {
            next();
        }
    });


    // CREATE ---------------------------------------------------
    app.get('/admin/produkt/opret', (req, res, next) => {

        res.render('create_product');
    });

    app.post('/admin/produkt/opret', (req, res, next) => {
        if (!req.files || !req.files.image) {
            return next(new Error('Der var ingen fil med formularen.'));
        }

        fs.readFile(req.files.image.path, (err, data) => {

            if (err) {
                return next(new Error('Den midlertidige fil kunne ikke læses.'));
            }

            fs.writeFile(`./public/uploads/${req.files.image.name}`, data, (err) => {

                if (err) {
                    return next(new Error('Filen kunne ikke gemmes.'));
                }

                db.query(`INSERT INTO products (name, description, image, price) 
            VALUES (?, ?, ?, ?);`, [req.fields.name, req.fields.description, req.files.image.name, req.fields.price], (err, results) => {
                    if (err) res.send(err);
                    res.redirect('/admin');
                });
            });
        });
    });


    // UPDATE ---------------------------------------------------
    app.get('/admin/produkt/rediger/:id', (req, res, next) => {
        const sql =
            `
        SELECT products.id, products.name, products.description
        FROM cms.products
        WHERE products.id = ?;
        `;

        db.query(sql, [req.params.id], (err, results) => {
            res.render('update_products', {
                'mainResults': results
            });
        });
    });

    app.patch('/admin/produkt/rediger/:id', (req, res, next) => {
        if (!req.files.image) {
            db.query(`UPDATE cms.products 
            SET products.name = ?, products.description = ?
            WHERE products.id = ?;`, [req.fields.name, req.fields.description, req.files.image, req.params.id], (err, results) => {
                if (err) res.send(err);
                res.status(200);
                res.end();
    });
        } else {

            if (!req.files || !req.files.image) {
                return next(new Error('Der var ingen fil med formularen.'));
            }

            fs.readFile(req.files.image.path, (err, data) => {

                if (err) {
                    return next(new Error('Den midlertidige fil kunne ikke læses.'));
                }

                fs.writeFile(`./public/uploads/${req.files.image.name}`, data, (err) => {

                    if (err) {
                        return next(new Error('Filen kunne ikke gemmes.'));
                    }

                    db.query(`UPDATE products 
                    SET products.name = ?, products.description = ?, products.image = ?
                    WHERE products.id = ?;`, [req.fields.name, req.fields.description, req.files.image, req.files.price.name, req.params.id], (err, results) => {
                        if (err) res.send(err);
                        res.status(200);
                        res.end();
                    });
                });
            });
        }

    });

    // DELETE ---------------------------------------------------

    //Delete check
    app.get('/admin/produkt/slet-tjek/:id', (req, res, next) => {
        const sql =
            `   
        SELECT products.id, products.name, products.image
        FROM products
        WHERE products.id = ?;
        `;

        db.query(sql, [req.params.id], (err, results) => {
            res.render('delete_product', {
                'mainResults': results
            });
        });
    });

    //Delete IT
    app.get('/admin/produkt/slet/:id', (req, res, next) => {
        const sql =
            `
        DELETE FROM products WHERE products.id = ?;
        `;

        db.query(sql, [req.params.id], (err, results) => {
            res.redirect('/admin');
        });
    });


};