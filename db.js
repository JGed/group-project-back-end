const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ClickNCook', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate()
    .then(
        () => console.log('Connection has been established sucessfully.')
    )
    .catch(
        err => console.log('Unable to connect to the databse:', err)
    );

module.exports = sequelize;