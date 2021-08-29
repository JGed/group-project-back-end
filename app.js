require('dotenv').config();
let express = require('express');
const app = express();
const sequelize = require('./db');
const user = require('./controllers/usercontroller');

sequelize.sync();

app.use(express.json());
app.use('/user', user);

app.listen(process.env.PORT, () => console.log('App is listening.'))