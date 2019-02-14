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

    // UPDATE ---------------------------------------------------
    app.get('/admin/home/rediger/:id', (req, res, next) => {
        const sql = 
        `
        SELECT * FROM cms.home 
        WHERE home.id = ?;
        `;

        db.query(sql, [req.params.id], (err, results) => {
            res.render('update_otherdata', {'mainResults': results});
        });
    });
    
    app.post('/admin/home/rediger/:id', (req, res, next) => {
        if(!req.files.image.name){
            db.query(`UPDATE home 
            SET home.title = ?, home.text = ?
            WHERE home.id = ?;`, [req.fields.title, req.fields.text, req.params.id], (err, results) => {
                if (err) res.send(err);
                res.redirect('/admin');
            });
        } else {

            if(!req.files || !req.files.image){
                return next(new Error('Der var ingen fil med formularen.'));
            }
            
            fs.readFile(req.files.image.path, (err, data) => {
                
                if(err){
                    return next(new Error('Den midlertidige fil kunne ikke læses.'));
                }
                
                fs.writeFile(`./public/uploads/${req.files.image.name}`, data, (err) => {
                
                if(err) {
                    return next(new Error('Filen kunne ikke gemmes.'));
                }

            db.query(`UPDATE home 
            SET home.title = ?, home.text = ?, home.image = ?
            WHERE home.id = ?;`, [req.fields.title, req.fields.text, req.files.image.name, req.params.id], (err, results) => {
                if (err) res.send(err);
                res.redirect('/admin');
            });
        });
    });
}

});

};