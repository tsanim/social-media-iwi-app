const env = process.env.NODE_ENV || 'development';

const express = require('express');

const config = require('./config/config')[env];

const favicon = require('express-favicon');
const path = require('path');

require('./config/database')(config);
const app = express();
require('./config/express')(app);
require('./config/routes')(app);

// General error handling
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message, error });
    next();
})

app.use(favicon('client/iwi-app/build/iwi_logo.png'));

app.use(express.static(path.join(__dirname, '/client/iwi-app/build')));

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.get('*', (request, response) => {
        response.sendFile(path.resolve('./', 'client', 'iwi-app', 'build', 'index.html'));
    });
}

app.listen(config.port, () => console.log(`Server is listening to port ${config.port}`));

