const account = require("./account/lib.js");

module.exports = function(app) {
    app.post('/login',account.login);
    app.post('/signup',account.signup);
    app.patch('/update',account.update);
    app.post('/get_user',account.get_user);
};