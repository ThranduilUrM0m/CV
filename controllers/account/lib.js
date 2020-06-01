const User = require('../../models/Users.js');
const Token = require('../../models/Tokens.js');
const passwordHash = require("password-hash");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config()

async function verification_email(user_email, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
        }
    });
    let info = await transporter.sendMail({
        from: 'yassmineboutalebqlii@gmail.com', // sender address
        to: user_email, // list of receivers
        subject: 'Hello ✔ and Welcome', // Subject line
        text: text, // plain text body
    });
    console.log('Message sent: %s', info.messageId);
}
async function main(mail_username, mail_location, mail_email, mail_phone, mail_content) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
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
}
async function signup(req, res) {
    const { username, email, password, _fingerprint, _role } = req.body;
    try {
        if (!username || !email || !password || !_fingerprint || !_role) {
            return res.status(400).json({
                text: "It looks like some information about u, wasn't correctly submitted, please retry."
            });
        }
        const user = {
            username: username,
            email: email,
            password: passwordHash.generate(password),
            fingerprint: _fingerprint,
            role: _role,
        };
        const findUserByEmail = await User.findOne({
            email: user.email
        });
        const findUserByUsername = await User.findOne({
            username: user.username
        });
        if (findUserByEmail) {
            return res.status(400).json({
                text: "This Email exists already can u, please submit another Email."
            });
        }
        if (findUserByUsername) {
            return res.status(400).json({
                text: "This Username exists already can u, please submit another Username."
            });
        }
        
        // Sauvegarde de l'utilisateur en base
        const userData = new User(user);
        const userObject = await userData.save();
        // Create a verification token for this user
        var token = new Token({ _userId: userData._id, token: crypto.randomBytes(16).toString('hex') });
        const tokenObject = await token.save();
        //send mail
        verification_email(userData.email, 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n');
        return res.status(200).json({
            text: "And that's it, only thing left is verify your email. \nWe have sent you an email verification."
        });
    } catch (error) {
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
    const { _user, _old_username, _old_email, _current_password, _new_password } = req.body;
    try {
        if (!_user.username || !_user.email) {
            //Le cas où l'email ou bien le password ne serait pas soumit ou nul
            return res.status(400).json({
                text: "It looks like some information about u, wasn't correctly submitted, please retry."
            });
        }
        if(!passwordHash.verify(_current_password, _user.password)) {
            return res.status(400).json({
                text: "Password Invalid"
            });
        }
        // Création d'un objet user, dans lequel on hash le mot de passe
        const user = {
            username: _user.username,
            email: _user.email,
            password: passwordHash.generate(_new_password ? _new_password : _current_password),
        };
        // Sauvegarde de l'utilisateur en base
        const findUser = await User.findOneAndUpdate(
            { email : _old_email },
            {
                $set : {
                    username : user.username,
                    email : user.email, 
                    password : user.password
                }
            },
            { upsert: true }
        );
        verification_email(findUser.email, 'Hello,\n\n' + 'your information has been changed, if this wasn\'t you, please contact us.\n');
        return res.status(200).json({
            text: "User updated successfully.",
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
}
async function update_roles(req, res) {
    const { _user_toEdit_username, _user_toEdit_roles } = req.body;
    try {
        // Sauvegarde de l'utilisateur en base
        const findUser = await User.findOneAndUpdate(
            { username : _user_toEdit_username },
            {
                $set : {
                    roles: _user_toEdit_roles,
                }
            },
            { upsert: true }
        );
        verification_email(findUser.email, 'Hello,\n\n' + 'your account has been marked to be deleted, if you wish to undo that, just login in the next 7 days, if u choose not to, your account will be automatically deleted after the 7 days.\n We thank you for your support.');
        return res.status(200).json({
            text: "User Roles updated successfully.",
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
}
async function login(req, res) {
    const { password, email } = req.body;
    
    try {
        if (!email || !password) {
            //Le cas où l'email ou bien le password ne serait pas soumit ou nul
            return res.status(400).json({
                text: "Please fill out both email and password."
            });
        }
        // On check si l'utilisateur existe en base
        const findUser = await User.findOne({ 
            email 
        });
        if (!findUser)
            return res.status(401).json({
                text: "Verify your email, this account is not registred."
            });
        if (!findUser.authenticate(password))
            return res.status(401).json({
                text: "Incorrect Password."
            });
        if(!findUser.isVerified)
            return res.status(401).json({
                text: "Your account has not been verified. Please check your inbox for a verification email that was sent to you."
            });
        if((findUser.roles).includes('Deleted')) {
            // Sauvegarde de l'utilisateur en base
            await User.findOneAndUpdate(
                { email : email },
                {
                    $set : {
                        roles: findUser.roles.filter(function(value, index, arr){ return value != 'Deleted';}),
                    }
                },
                { upsert: true }
            );
        } 
        return res.status(200).json({
            token: findUser.getToken(),
            email: findUser.email,
            username: findUser.username,
            text: "Authentification successful."
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
async function get_users(req, res) {
    try {
        // On check si l'utilisateur existe en base
        const findUsers = await User.find();
        if (!findUsers)
            return res.status(401).json({
                text: "No users found."
            });
        return res.status(200).json({
            users: findUsers
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
}
async function confirmationPost(req, res, next) {
    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return res.status(400).json({ text: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).json({ text: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).json({ text: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).json({ text: err.message }); }
                res.status(200).json({text: "The account has been verified. Please log in."});
            });
        });
    });
}
async function resendTokenPost(req, res, next) {
 
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
 
            // Send the email
            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
 
    });
}

exports.get_user = get_user;
exports.get_users = get_users;
exports.login = login;
exports.signup = signup;
exports.send_mail = send_mail;
exports.update = update;
exports.update_roles = update_roles;
exports.confirmationPost = confirmationPost;
exports.resendTokenPost = resendTokenPost;