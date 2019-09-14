const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { mongoose } = require('./config/config');
const { Recipe } = require('./models/recipe');
const { User } = require('./models/user');

app.use(bodyParser.json());

app.post('/recipe', async (req, res) => {
  const recipe = new Recipe(req.body);

  try {
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

    res.status(200).send('User successfully saved');
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// tic-tac-toe with web socket. 
