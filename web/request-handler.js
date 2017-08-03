var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var request = require('request');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  if (req.method === 'GET') {
    if (req.url === '/') {
      httpHelpers.serveAssets(res, '/', (err, content)=>{
        //This file has a post capabilities
      });
    } if (req.url === '/?loading=true') {
      httpHelpers.serveAssets(res, '/?loading=true', (err, content)=>{
        //This file has a post capabilities
      });
    } else if (req.url.length > 1) {
      // page request of http://xxx.xxx.xx.xx:8080/Something_else_added
      //START HERE
      // console.log('REQUEST METHOD & url line 12: ', req.method, req.url);
      var url = req.url.replace(/^\/|\/$/g, '');
      archive.isUrlInList (url, (IS_IN_LIST) => {
        if (IS_IN_LIST) {
          archive.isUrlArchived (url, (IS_ARCHIVED)=>{
            if (IS_ARCHIVED) {
              // true: return content
              var urlPath = path.join(__dirname, '../archives/sites/' + url);
              httpHelpers.serveAssets(res, urlPath, (err, content)=>{

              });
            } else { // NOT ARCHIVED && Redirect here from get xxx.xxx.com/xxx.xxx.com
              res.writeHead(302, {'location': `./?loading=true`});
              res.end('There is no shortcut in life!');
            }
          });
        } else { // This happens when there is a GET request at xxx.xxx.xxx.xxx/{archive_website}
          res.writeHead(404, {});
          res.end('There is no shortcut in life!');
        }
      });
    }
  } else if (req.method === 'POST' && req.url === '/') {  //index.html & loading.html only
    console.log(req.url);
    let urlToArchive = '';
    req.on('data', function (urlParams) {  // ./xxx.html?url=www.xxx.com&asdf=asdf
      urlToArchive += urlParams;  // append url=www.xxx.com&asdf=asdf&test=test......
    });
    req.on('end', function () {
      var newArchiveUrl = urlToArchive.replace('url=', '');
      archive.isUrlArchived (newArchiveUrl, (IS_ARCHIVED)=>{
        if (IS_ARCHIVED) {
          res.writeHead(302, {'location': `./${newArchiveUrl}`});
          res.end();
        } else {
          archive.addUrlToList(newArchiveUrl, ()=>{
            res.writeHead(302, {'location': `./?loading=true`});
            res.end();
          });
        }
      });
    });
  }
};