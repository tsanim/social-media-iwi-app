const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('../models/User');

module.exports= ({ mongoUrl }) => {
    mongoose.connect(mongoUrl, { useNewUrlParser: true });

    const db = mongoose.connection;

    db.once('open', (err) => {
        if(err) console.log(err);

        //Seed Admin with once open database
        User.seedAdmin()
        .then(user => {
            console.log('Database is ready!');
        }).catch(err => {
            console.log(err);
        });
    });

    db.on('error', (reason) => {
        console.log(reason);
    });
};