const fs = require('fs');
const db = require('../config/mysql')();
const bcrypt = require('bcryptjs');

module.exports = function (app) {
	
	// ---------------	Log ind --------------- //

	app.get('/login', (req, res, next) => {
		if (req.query.status && req.query.status === 'badcredentials') {
			res.locals.status = 'ugyldigt brugernavn eller adgangskode';
		}
		res.render('login', { title: 'Log ind' });
	});

	app.post('/auth/login', (req, res, next) => {
		db.query('SELECT id, roles_id FROM cms.users WHERE username = ?', [req.fields.username], (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:9:5)`);
			if (result.length !== 1) {
				res.redirect('/login?status=badcredentials');
				return;
			}
			req.session.user = result[0].id;
			app.locals.login = true;
			res.redirect('/profile');
		});
	});


	// --------------- Log ud --------------- //

	app.get('/auth/logout', (req, res, next) => {
		req.session.destroy();
		app.locals.login = false;
		res.redirect('/');
	});


	// --------------- Opret bruger --------------- //

	app.get('/opret-bruger', (req, res, next) => {
        res.render('signup', { title: 'Opret bruger' });
	});
	
	app.post('/auth/opret-bruger', (req, res, next) => {
		let success = true;
		let errorMessage;

		// VALIDATION
		if(req.fields)
		{
			//SELECT users by username
			db.query(`SELECT users.id 
			FROM users 
			WHERE users.username LIKE ?;`, [req.fields.username], (err, checkResults) => {
				//console.log(checkResults.length);
				//Checking if username already exist
				if(checkResults.length > 0){
					//console.log(checkResults.length);
					success = false;
					errorMessage = 'Brugernavn findes allerede';
					res.render('signup', { ...req.fields, 'title': 'Opret bruger', errorMessage });
					return;
				}

				//Checking empty inputs
				else if(!req.fields.username ||  !req.fields.password || !req.fields.passwordCheck ){
					success = false;
					errorMessage = 'En eller flere inputs var tomme';
					res.render('signup', { ...req.fields, 'title': 'Opret bruger', errorMessage });
					return;
				}

				//Checking if repeat password is the same as password
				else if(req.fields.password !== req.fields.passwordCheck){
					success = false;
					errorMessage = '"Adgangskode" og "Gentag adgangskode" var ikke ens';
					res.render('signup', { ...req.fields, 'title': 'Opret bruger', errorMessage });
					return;
				}

				//Creating the user
				else if(success === true) {
					let hash_password = bcrypt.hashSync(req.fields.password, 10);
					db.query(`INSERT INTO users (username, password, roles_id)
					VALUES (?, ?, 4) `, [req.fields.username, hash_password], (err, results) => {
						res.redirect('/login');
					});
				}
			});
		}
	});
};
