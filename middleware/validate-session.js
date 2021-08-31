const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

const validateSession = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === undefined) {
        return res.status(403).send({
            auth: false,
            message: 'No token provided',
        });
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (!err && decodedToken) {
                try {
                    const user = await User.findOne({
                        where: {
                            id: decodedToken.id,
                        },
                    });
                    if(!user) throw err;
                    req.user = user;
                    return next();
                } catch(err) {
                    next(err);
                }
            } else { 
                req.errors = err;
                return res.status(500).send({
                    message: 'Not Authorized'
                });
            }
        });
    }
};

module.exports = validateSession;