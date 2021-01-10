const cors = require('cors')({origin: true}); // origin:true gives any url access to the endpoint

const cheerio = require('cheerio');
const getUrls = require('get-urls');
const fetch = require('node-fetch');

const scrapeMetatags = (text) => {

  const urls = Array.from(getUrls(text)); // extract all valid urls from the text

  // map all urls into individual requests
  const requests = urls.map(async url => {

    const res = await fetch(url);

    const html = await res.text(); // res.text() returns the html for the webpage
    const $ = cheerio.load(html);

    return {
      url,
      title: $('title').first().text(), // text in the title tag ex. Fireship.io
    }

  });

  return Promise.all(requests); // run all requests concurrently 

}


module.exports = scrapeMetatags;

// About the Strategy
// doesn't get the dynamic content rendered after the fact with javascript