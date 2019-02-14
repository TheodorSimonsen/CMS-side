const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());          // Accept JSON objects

    // Accept extended form elements in requests
    app.use(bodyParser.urlencoded({
	'extended': true
}));

}