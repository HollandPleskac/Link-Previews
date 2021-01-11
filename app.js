const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const scrapeMetatags = require('./link-previews');

const app = express();

app.use(bodyparser.json()); // extract the entire body portion of an incoming request and exposes it on req.body

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.post('/', async function (request, response) {
  const body = request.body;
  const data = await scrapeMetatags(body.text);
  response.json({ 'data': data });
});

app.listen(3000);