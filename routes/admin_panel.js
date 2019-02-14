const db = require('../config/mysql')();

module.exports = (app) => {
    app.use('/admin', (req, res, next) => {
        if (!req.session.user) {
            res.redirect('/login');

            return;
        } else {
            db.query(`SELECT roles_id AS rank FROM users
                    WHERE id = ?`, [req.session.user], function (err, rank) {
                if (err) res.send(err);
                if (rank[0].rank !== 1) {
                    res.render('login', {
                        'status': 'Du har ikke tilladelse'
                    });
                    return;
                } else {
                    next();
                }
            });

        }
    });

    //ADMIN PANEL -------------------------------------------------------------------------
    app.get('/admin', (req, res, next) => {

        //Select Homepage
        db.query(`SELECT * FROM home;`, (err, homeResults) => {

            //Select Styles
            db.query(`SELECT styles.id, styles.title FROM styles;`, (err, stylesResults) => {

                //Select Products
                db.query(`SELECT products.id, products.name, products.image FROM cms.products;`, (err, productsResults) => {

                    //Select Levels
                    db.query(`SELECT levels.id, levels.title FROM levels;`, (err, levelsResults) => {

                        //Select Age Groups
                        db.query(`SELECT age_groups.id, age_groups.title FROM age_groups;`, (err, ageResults) => {

                            res.render('admin', {
                                'title': 'Administration Panel | Landdrup Dans',
                                homeResults,
                                stylesResults,
                                productsResults,
                                levelsResults,
                                ageResults,
                            });
                        });

                    });

                });

            });
        });


        /*const sql = 
        `
        //SELECT * FROM home;
        
        //SELECT styles.id, styles.title 
        FROM styles;

        //SELECT instructors.id, instructors.name 
        FROM instructors;

        //SELECT levels.id, levels.title 
        FROM levels;

        //SELECT age_groups.id, age_groups.title 
        FROM age_groups;

        //SELECT groups.id, styles.title AS style, age_groups.title AS age_group , 
        levels.title AS level, instructors.name AS instructor, groups.price 
        FROM groups 
        LEFT OUTER JOIN styles ON groups.style = styles.id
        LEFT OUTER JOIN age_groups ON groups.age_group = age_groups.id
        LEFT OUTER JOIN levels ON groups.level = levels.id
        LEFT OUTER JOIN instructors ON groups.instructor = instructors.id;
        `;

        db.query(sql, (err, results) => {
            res.render('admin', {'title': 'Administration Panel | Landdrup Dans', 
            'homeResults': results[0], 
            'stylesResults': results[1],
            'instructorResults': results[2],
            'levelsResults': results[3],
            'ageResults': results[4],
            'groupResults': results[5]
            });
        });*/
    });
    // res.render('admin', {'title': 'Administration Panel | Landdrup Dans', 
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
}