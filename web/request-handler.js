var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var request = require('request');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.url.length > 1) {
    // page request of http://xxx.xxx.xx.xx:8080/Something_else_added
    //START HERE
    console.log('REQUEST METHOD & url line 12: ', req.method, req.url);

    if (req.method === 'GET') {
      var url = req.url.replace(/^\/|\/$/g, '');
      archive.isUrlInList (url, (IS_IN_LIST) => {
        if (IS_IN_LIST) {
          archive.isUrlArchived (url, (IS_ARCHIVED)=>{
            if (IS_ARCHIVED) {
              // true: return content
              var urlPath = path.join(__dirname, '../archives/sites/' + url);
              httpHelpers.serveAssets(res, urlPath, (err, content)=>{

              });
            } else { // NOT ARCHIVED
              var loadingPath = path.join(__dirname, './public/loading.html');
              httpHelpers.serveAssets(res, loadingPath, (err, content)=>{
              });
            }
          });
        } else { // This happens when there is a GET request at xxx.xxx.xxx.xxx/{archive_website}
          res.writeHead(404, {});
          res.end('There is no shortcut in life!');
        }
      });
    } else { //Initial POST request for {archive_website} via input form submit
      let body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        var newArchiveUrl = body.replace('url=', '');
        archive.addUrlToList(newArchiveUrl, ()=>{
          res.writeHead(302, {'location': `./${newArchiveUrl}`});  //Redirect to ...line 26 - NOT ARCHIVED
          res.end();
        });
      });
    }
  } else {  // request url = '/'
    if (req.method === 'GET') { //Serving index.html
      httpHelpers.serveAssets(res, '/', (err, content)=>{

      });
    } else { //Initial POST request for {archive_website} via input form submit
      let body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        var newArchiveUrl = body.replace('url=', '');
        archive.addUrlToList(newArchiveUrl, ()=>{
          res.writeHead(302, {'location': `./${newArchiveUrl}`});  //Redirect to ...line 26 - NOT ARCHIVED
          res.end();
        });
      });

    }
    // res.end(archive.paths.list);
  }

};



/*
  - after posting www.amazon.com
  localhost:8080/www.amazon.com

=>posts  more urls
*/