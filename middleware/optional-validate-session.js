const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

const optionalValidateSession = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === undefined) {
        return next();
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (!err && decodedToken) {
                try {
                    const user = await User.findOne({
                        where: {
                            id: decodedToken.id,
                        },
                    });
                    if (!user) throw err;
                    req.user = user;
                    return next();
                } catch (err) {
                    next(err);
                }
            } else {
                req.errors = err;
                return next();
            }
        });
    }
};

module.exports = optionalValidateSession;
