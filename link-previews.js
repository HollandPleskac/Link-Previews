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

    // look for the first availiable meta tag
    // multiple formats of meta tags are included on some websites
    // this functions allows you to have clean code
    const getMetatag = (name) =>
      $(`meta[name=${name}]`).attr('content') ||
      $(`meta[property="og:${name}"]`).attr('content') ||
      $(`meta[property="twitter:${name}"]`).attr('content');

    return {
      url,
      title: $('title').first().text(), // text in the title tag ex. Fireship.io
      favicon: $('link[rel="shortcut icon"]').attr('href'), // .attr('href') gives the link to the actual favicon image
      // description: $('meta[name=description]').attr('content'), // grab the content from the description meta tag
      description: getMetatag('description'),
      image: getMetatag('image'),
      author: getMetatag('author'),
    }

  });

  return Promise.all(requests); // run all requests concurrently 

}

module.exports = scrapeMetatags;

// About the Strategy
// doesn't get the dynamic content rendered after the fact with javascript