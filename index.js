//init env 
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

//init express
const express = require('express');

//init config object
const config = require('./config/config')[env];

const favicon = require('express-favicon');
const path = require('path');

//init db
require('./config/database')(config);

//init app
const app = express();

//init express
require('./config/express')(app);

//init routes
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

