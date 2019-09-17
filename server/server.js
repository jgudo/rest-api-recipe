require('./config/config');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { Recipe } = require('./models/recipe');
const { User } = require('./models/user');
const { authenticate } = require('./middlewares/authenticate');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/recipe', authenticate, async (req, res) => {
  try {
    const recipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      recipes: req.body.recipes,
      created: new Date().getTime(),
      creatorName: req.user.fullname,
      _creator: req.user._id
    });  
    const doc = await recipe.save();
    const { _id, name, description, recipes, created, creatorName} = doc;
    res.status(200).send({ _id, name, description, recipes, created, creatorName });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.get('/recipes/all', async (req, res) => { // testing
  const recipes = await Recipe.find({});
  res.send(recipes);
});

app.get('/recipes', authenticate, async (req, res) => {
  if (req.query._id) {
    if (!ObjectID.isValid(req.query._id)) {
      return res.status(404).send();
    }
  }
  
  try {
    const recipes = await Recipe.find({ 
      _creator: req.user._id,
      ...req.query
    });

    if (recipes.length !== 0) {
      res.status(200).send(recipes);
    } else {
      res.status(404).send({ status: 404, message: 'No recipes found' });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/recipe/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  try {
    const recipe = await Recipe.findOne({ _id: id, _creator: req.user._id });

    if (!recipe) res.status(404).send();

    res.status(200).send(recipe);
  } catch (e) {
    res.status(400).send();
  }
});

app.delete('/recipe/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  try {
    const result = await Recipe.findOneAndDelete({ _id: id, _creator: req.user._id });
    if (!result) res.status(404).send();

    res.status(200).send(result);
  } catch (e) {
    res.status(400).send();
  }
});

app.patch('/recipe/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  try {
    const result = await Recipe.findOneAndUpdate({ 
      _id: id,
      _creator: req.user._id
    }, {
      $set: req.body
    },
    {
      new: true
    });

    if (!result) res.status(404).send();

    res.status(200).send({ result });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

app.post('/user', async (req, res) => {
  const user = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    dateJoined: new Date().getTime(),
    password: req.body.password
  });

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send({ 
      fullname: user.fullname, 
      email: user.email,
      token 
    });
    // res.status(200).send('User successfully saved');
  } catch (e) {
    res.status(400).send({
      status: 400,
      message: 'Invalid request'
    });
  }
});

app.post('/user/login', async (req, res) => {
  try {
    const user = await User.findCredential(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.header('x-auth', token).send({ 
      fullname: user.fullname, 
      email: user.email,
      token 
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/user/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.get('/users', async (req, res) => { // testing
  const users = await User.find({});
  res.status(200).send(users);
});

app.listen(port, () => {
  console.log('Server running on port 3000');
});

// tic-tac-toe with web socket. 
