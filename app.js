const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors')({ origin: true }); // origin:true gives any url access to the endpoint

const scrapeMetatags = require('./scrape-metatags');

const app = express();

app.use(bodyparser.json()); // extract the entire body portion of an incoming request and exposes it on req.body

app.post('/', async function (request, response) {

  const body = request.body;
  const data = await scrapeMetatags(body.text);
  response.json({ 'data': data });

});

app.listen(3000);