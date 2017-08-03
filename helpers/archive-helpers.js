var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, content) => {
    if (err) {
      callback(err);
    } else {
      var lineArr = content.split('\n');
      callback(lineArr);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls( function(array) {
    if (array.indexOf(url) > -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  console.log('addUrlToList', url);
  exports.isUrlInList(url, (isit)=>{
    if (isit) {
      callback();
    } else {
      fs.appendFile(exports.paths.list, url + '\n', function (err) {
        if (err) { throw err; }
        callback();
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  //console.log("isUrlArchived url: ", url);
  var fixturePath = `${exports.paths.archivedSites}/${url}`;
  if (fs.existsSync(fixturePath)) {
    callback(true);
  } else {
    callback(false);
  }
};

exports.downloadUrls = function(urls) {
  for (let url of urls) {
    // Create or clear the file.
    if (url.length > 0) {
      var fixturePath = `${exports.paths.archivedSites}/${url}`;
      request(`http://${url}`).pipe(fs.createWriteStream(fixturePath));
    }
  }
};
