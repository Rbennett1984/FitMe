const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {PhoppingList, Workouts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

//
ProductList.create('pilates', 2);
ProductList.create('yoga', 3);
ProductList.create('HITT', 4);

// adding some workout to "workouts" so there's something
// to retrieve.
Workouts.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Workouts.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);

// when the root of this router is called with GET, return
// all current ProductList items
app.get('/product-list', (req, res) => {
  res.json(ProductList.get());
});

app.post('/product-list', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = ProductList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
app.put('/shopping-list/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'budget', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating product list item \`${req.params.id}\``);

  ProductList.update({
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget
  });

  res.status(204).end();
});

// when DELETE request comes in with an id in path,
// try to delete that item from ShoppingList.
app.delete('/product-list/:id', (req, res) => {
  ProductList.delete(req.params.id);
  console.log(`Deleted product list item \`${req.params.ID}\``);
  res.status(204).end();
});


app.get('/workouts', (req, res) => {
  res.json(Recipes.get());
});

app.post('/workouts', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'ingredients'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = Workouts.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
});

// when PUT request comes in with updated recipe, ensure has
// required fields. also ensure that recipe id in url path, and
// recipe id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `workouts.updateItem` with updated workout.
app.put('/workouts/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'ingredients', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating workout \`${req.params.id}\``);
    workouts.update({
    id: req.params.id,
    name: req.body.name,
    ingredients: req.body.ingredients
  });
  res.status(204).end();
});

// Delete workouts (by id)!
app.delete('/workouts/:id', (req, res) => {
  Workouts.delete(req.params.id);
  console.log(`Deleted workout list item \`${req.params.ID}\``);
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});