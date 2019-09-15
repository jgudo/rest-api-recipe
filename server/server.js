const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { mongoose } = require('./config/config');
const { Recipe } = require('./models/recipe');
const { User } = require('./models/user');
const { authenticate } = require('./middlewares/authenticate');

app.use(bodyParser.json());

app.post('/recipe', authenticate, async (req, res) => {
  try {
    const recipe = new Recipe({
      name: req.body.name,
      created: new Date().getTime(),
      _creator: req.body._id
    });  
    const doc = await recipe.save();
    res.status(200).send(doc);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.get('/recipes', async (req, res) => {
  try {
    console.log(req.query);
    const recipes = await Recipe.find({});
    res.status(200).send(recipes);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/user', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
    // res.status(200).send('User successfully saved');
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/user/login', async (req, res) => {
  try {
    const user = await User.findCredential(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users', async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// tic-tac-toe with web socket. 
