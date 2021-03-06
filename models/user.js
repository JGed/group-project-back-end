const Recipe = require('../db').import('./recipe');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        passwordhash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    User.hasMany(Recipe, {foreignKey: 'owner', sourceKey: 'username'});
    return User;
}
