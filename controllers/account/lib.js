const User = require('../../models/Users.js');
const passwordHash = require("password-hash");
const nodemailer = require('nodemailer');

async function main(user_email) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    
    //let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail', // true for 465, false for other ports
        auth: {
            user: 'yassmineboutalebqlii@gmail.com', // generated ethereal user
            pass: '[1234abcd]' // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'yassmineboutalebqlii@gmail.com', // sender address
        to: user_email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
async function main(mail_username, mail_location, mail_email, mail_phone, mail_content) {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // true for 465, false for other ports
        auth: {
            user: 'yassmineboutalebqlii@gmail.com', // generated ethereal user
            pass: '[1234abcd]' // generated ethereal password
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: mail_email, // sender address
        to: 'zakariaeboutaleb@gmail.com', // list of receivers
        subject: 'username : '+mail_username+' location : '+mail_location+' phone : '+mail_phone, // Subject line
        text: mail_content, // plain text body
    });
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
async function signup(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        return res.status(400).json({
            text: "Requête invalide"
        });
    }
    // Création d'un objet user, dans lequel on hash le mot de passe
    const user = {
        username: username,
        email: email,
        password: passwordHash.generate(password),
    };
    // On check en base si l'utilisateur existe déjà
    try {
        const findUserByEmail = await User.findOne({
            email: user.email
        });
        const findUserByUsername = await User.findOne({
            username: user.username
        });
        if (findUserByEmail || findUserByUsername) {
            return res.status(400).json({
                text: "L'utilisateur existe déjà"
            });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }

    try {
        // Sauvegarde de l'utilisateur en base
        const userData = new User(user);
        const userObject = await userData.save();
        main(user.email).catch(console.error);
        return res.status(200).json({
            text: "Succès",
            email: user.email,
            username: user.username,
            token: userObject.getToken()
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}
async function send_mail(req, res) {
    const { mail_username, mail_location, mail_email, mail_phone, mail_content } = req.body;
    if(!mail_username || !mail_email || !mail_content) {
        return res.status(400).json({
            text: "Requête invalide"
        });
    }
    try {
        main(mail_username, mail_location, mail_email, mail_phone, mail_content).catch(console.error);
    }catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}
async function update(req, res) {
    const { _user, _new_password, _old_email } = req.body;
    if (!_user.username || !_user.email || !_user.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        return res.status(400).json({
            text: "Requête invalide"
        });
    }
    // Création d'un objet user, dans lequel on hash le mot de passe
    const user = {
        email: _user.email,
        username: _user.username,
        password: passwordHash.generate(_new_password),
        firstname: _user.firstname,
        lastname: _user.lastname,
        activated: _user.activated,
        messages: _user.messages,
        whoami: _user.whoami,
        school: _user.school,
    };
    try {
        // Sauvegarde de l'utilisateur en base
        const findUser = await User.findOneAndUpdate(
            { email : _old_email },
            {
                $set : {
                    email : user.email, 
                    username : user.username,
                    password : user.password,
                    firstname : user.firstname,
                    lastname : user.lastname,
                    activated : user.activated,
                    messages : user.messages,
                    whoami : user.whoami,
                    school : user.school,
                }
            },
            { upsert: true }
        );
        //main(user.email).catch(console.error);
        return res.status(200).json({
            text: "Succès",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}
async function login(req, res) {
    const { password, email } = req.body;
    if (!email || !password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        return res.status(400).json({
            text: "Requête invalide"
        });
    }
    try {
        // On check si l'utilisateur existe en base
        const findUser = await User.findOne({ 
            email 
        });
        if (!findUser)
            return res.status(401).json({
                text: "L'utilisateur n'existe pas"
            });
        if (!findUser.authenticate(password))
            return res.status(401).json({
                text: "Mot de passe incorrect"
            });
        return res.status(200).json({
            token: findUser.getToken(),
            email: findUser.email,
            username: findUser.username,
            text: "Authentification réussi"
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
}
async function get_user(req, res) {
    const { email } = req.body;
    if (!email) {
        //Le cas où l'email ne serait pas soumit ou nul
        return res.status(400).json({
            text: "Requête invalide"
        });
    }
    try {
        // On check si l'utilisateur existe en base
        const findUser = await User.findOne({ 
            email 
        });
        if (!findUser)
            return res.status(401).json({
                text: "L'utilisateur n'existe pas"
            });
        return res.status(200).json({
            user: findUser
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
}

exports.get_user = get_user;
exports.login = login;
exports.signup = signup;
exports.send_mail = send_mail;
exports.update = update;