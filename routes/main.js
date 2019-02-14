module.exports = function (app) {
    app.get('/secreht', (req, res, next) => {
        res.render('page');
    });
}