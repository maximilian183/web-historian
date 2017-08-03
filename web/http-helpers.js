var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var statusCode = 200;
  if (asset === '/') {
    // res.writeHead(statusCode, exports.headers);
    // res.end('/<input/');
    // return;
    fs.readFile(path.join(__dirname, './public/index.html'), 'utf8', (err, content) => {
      if(err) {
        callback(err);
      } else {
        res.writeHead(statusCode, exports.headers);
        res.end(content);
        callback(err, content);
      }
    });
    return;
  } else if (asset.indexOf('/?loading=true') > -1) {
    fs.readFile(path.join(__dirname, './public/loading.html'), 'utf8', (err, content) => {
      if(err) {
        callback(err);
      } else {
        res.writeHead(statusCode, exports.headers);
        res.end(content);
        callback(err, content);
      }
    });
    return;
  }

  fs.readFile(asset, 'utf8', (err, content) => {
    if(err) {
      callback(err);
    } else {
      res.writeHead(statusCode, exports.headers);
      res.end(content);
      callback(err, content);
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
