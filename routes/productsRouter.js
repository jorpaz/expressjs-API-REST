const express = require('express');
//const { initializeApp } = require('firebase-admin/app');

const productsService = require('../services/productService');
const {validatorHandler} = require('../middlewares/validatorHandler');
const { createProductSchema, updateProductSchema, getProductSchema} = require('../schemas/productSchemas');

const router = express.Router();
const service = new productsService;

//FIREBASE
const admin = require('firebase-admin');
let serviceAccount = require("../express-api-rest-bbbc9-firebase-adminsdk-19oyl-c8c062f74c.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://express-api-rest-bbbc9-default-rtdb.firebaseio.com/'
});
const db = admin.database();

router.get('/', async (req, res) => {
  const products = await service.find();

  db.ref('products').once('value', (snapshot) => {
    const dataProducts = snapshot.val();
    res.json({dataProducts});
  })
});

router.get('/filter', async (req, res) => {
  res.send('Yo soy un filter')
});

router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await service.findOne(id);
    res.json(product);
  } catch (error){
    next(error);
  }
});

router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res) => {
    const body = req.body;
    const newProduct = await service.create(body);
    res.status(201).json(newProduct);
    db.ref('products').push(newProduct);
    //res.redirect('/');
    console.log()
});

//Patch o Put
router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
  try{
    const { id } = req.params;
    const body = req.body;
    const product = await service.update(id, body);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const respuesta = await service.delete(id);
  res.json(respuesta);
});

module.exports = router;
