//clean user object 
module.exports = (user) => {
    const newUser = Object.assign({}, user);

    delete newUser.hashedPassword;
    delete newUser.salt;
    delete newUser.__v;

    return newUser
}