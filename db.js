const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // very important
          }
      }
});

sequelize.authenticate()
    .then(
        () => console.log('Connection has been established sucessfully.')
    )
    .catch(
        err => console.log('Unable to connect to the databse:', err)
    );

module.exports = sequelize;