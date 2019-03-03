const db = require('../config/mysql')();
const fs = require('fs');
const bcrypt = require('bcryptjs');

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
    app.get('/admin/user/opret', (req, res, next) => {

        res.render('create_user');
    });

    app.post('/admin/user/opret', (req, res, next) => {

        let hash_password = bcrypt.hashSync(req.fields.password, 10);
        db.query(`INSERT INTO users (username, password, roles_id)
                VALUES (?, ?, ?);`, [req.fields.username, hash_password, req.fields.roles_id], (err, results) => {
            if (err) res.send(err);
            res.redirect('/admin');
        });
    });


    // UPDATE ---------------------------------------------------
    app.get('/admin/user/rediger/:id', (req, res, next) => {
        const sql =
            `
            SELECT users.id, users.username, users.password
            FROM cms.users
            WHERE users.id = ?;
            `;

        db.query(sql, [req.params.id], (err, results) => {
            res.render('update_users', {
                'mainResults': results
            });
        });
    });

    app.patch('/admin/user/rediger/:id', (req, res, next) => {
        console.log(req.params.id);
        if (!req.files.image) {


            db.query(`UPDATE cms.users 
                                    SET users.username = ?, users.password = ?, users.roles_id = ?
                WHERE users.id = ?;`, [req.fields.username, req.fields.password, req.fields.roles_id, req.params.id], (err, results) => {
                if (err) res.send(err);
                res.status(200);
                res.end();
            });

        }

    });

    // DELETE ---------------------------------------------------

    //Delete check
    app.get('/admin/user/slet-tjek/:id', (req, res, next) => {
        const sql =
            `   
            SELECT users.id, users.username, users.password
            FROM users
            WHERE users.id = ?;
            `;

        db.query(sql, [req.params.id], (err, results) => {
            res.render('delete_user', {
                'mainResults': results
            });
        });
    });

    //Delete It
    app.get('/admin/user/slet/:id', (req, res, next) => {
        const sql =
            `
            DELETE FROM users WHERE users.id = ?;
            `;

        db.query(sql, [req.params.id], (err, results) => {
            res.redirect('/admin');
        });
    });


};