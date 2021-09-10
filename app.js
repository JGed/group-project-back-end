require('dotenv').config();
let express = require('express');
const app = express();
const sequelize = require('./db');
const user = require('./controllers/usercontroller');
const recipe = require('./controllers/recipecontroller');
sequelize.sync();

app.use(require('./middleware/headers'))
app.use(express.json());
app.use('/user', user);
app.use('/recipe', recipe);

app.listen(process.env.PORT, () => console.log('App is listening.'))