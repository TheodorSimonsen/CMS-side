// IMPORTS (NPM I)
//===========================================================
const express = require('express');
const pjson = require('./package.json');
const debug = require('debug');
const port = process.env.PORT || 1239;

// SERVER
//===========================================================
const app = express();

require('./config/index.js')(app);
require('./routes/index.js')(app);


// SERVER INIT
// ==========================================================
app.listen(port, () => {
	debug(`${pjson.name} v${pjson.version} is running on http://${process.env.SITE_HOST}:${port}`);
});