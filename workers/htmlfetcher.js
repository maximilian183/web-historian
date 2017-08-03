var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');
//require archive helpers

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

exports.goGetIt = function (callback) {
  //use readListOfUrls to get an array of all sites
  // exports.readListOfUrls = function(callback) {
  archive.readListOfUrls( function (array) {
    if (!Array.isArray(array)) {
      console.log('Go get it is not reading an array!');
      var err = array;
      callback(err);  //array will be an err if its not an array
    } else {
      //use downloadUrls to loop through array (create files if need vis sync & update file contents)
      //exports.downloadUrls = function(urls) {
      archive.downloadUrls(array);
      callback(array);
    }
  });
};

//START HERE: Test that above function creates files for ever url in sites.txt.  Each files should have 'blah blah' in it
//then look at TODO on line 71 in archive-helpers file
//NOTE: line 15 above will not appear in cronjob ( they do not shown console logs in window.  Instead they write to another file)  Look into this more