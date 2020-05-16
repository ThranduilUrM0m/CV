const account = require("./account/lib.js");

module.exports = function(app) {
    app.post('/login', account.login);
    app.post('/signup', account.signup);
    app.post('/send_mail', account.send_mail);
    app.patch('/update', account.update);
    app.post('/get_user', account.get_user);
    app.post('/confirmation', account.confirmationPost);
    app.post('/resend', account.resendTokenPost);
};