const feedRouter = require('../routes/feed');
const authRouter = require('../routes/auth');
const usersRouter = require('../routes/user');

module.exports = app => {
    //init routes
    app.use('/auth', authRouter);
    app.use('/feed', feedRouter);
    app.use('/user', usersRouter);
}
