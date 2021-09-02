const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

/*
    User Registration
*/
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body.user;
    try {
        const existingUsers = await User.findAll({
            where: {
                [Op.or]: [{ email: email }, { username: username }],
            },
        });
        // if the username or email is already registered construct a message to send back in the response
        if (existingUsers.length > 0) {
            let emailMessage, usernameMessage;
            for(existingUser of existingUsers) {
                if(existingUser.email === email) {
                    emailMessage = `${email} already registered with ClickNCook.`
                }
                if(existingUser.username === username) {
                    usernameMessage = `${username} already registered with ClickNCook.`
                }
            }
            res.status(409).json({
                emailMessage: emailMessage,
                usernameMessage: usernameMessage,
            });
            return;
        }
    } catch (error) {
        // catch error with findAll method and send it in the response
        res.status(500).json({
            message: 'problem searching for existing user',
            error: error,
        });
        return;
    }
    try {
        // create the new user in the table
        const newUser = await User.create({
            email: email,
            username: username,
            passwordhash: bcrypt.hashSync(password, 13),
        });
        // create a token with the newUser id
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24,
        });
        // send a success message and token with the repsonse
        res.status(200).json({
            message: 'User sucessfully created!',
            sessionToken: token,
        });
    } catch (error) {
        // catch error with create method and send it in the response
        res.status(500).json({
            messge: 'Something went wrong, please try again.',
            error: error,
        });
    }
});

/*
    User Login
*/
router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body.user;
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if(user !== null) {
            bcrypt.compare(password, user.passwordhash, (err, matches) => {
                if(!err && matches) {
                    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})
                    res.status(200).json({
                        message: 'User sucessfully logged in!',
                        sessionToken: token
                    })
                }
                else {
                    res.status(409).json({
                        passwordMessage: 'Incorrect password.'
                    })
                }
            })
        }
        else {
            res.status(409).json({
                emailMessage: 'Email not registered.'
            })
        }
    }
    catch(error) {
        res.status(500).json({
            mesage: 'Something went wront please try again.',
            error: error
        })
    }
})

module.exports = router;