var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var request = require('request');
// require more modules/folders here!

const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With,Content-Type, Accept',
  'access-control-max-age': 10 // Seconds.
};

exports.handleRequest = function (req, res) {
  if (req.url.length > 1) {
    // page request of http://xxx.xxx.xx.xx:8080/Something_else_added
    //START HERE
    var url = req.url.replace(/^\/|\/$/g, '');

    // if: isUrlInList()
    archive.isUrlInList (url, (IS_IN_LIST) => {
      if(IS_IN_LIST) {
      // true: isUrlArchived()
        archive.isUrlArchived (url, (IS_ARCHIVED)=>{
          if (IS_ARCHIVED) {
            // true: return content
            var urlPath = path.join(__dirname, '../test/testdata/sites/' + url);
            fs.readFile(urlPath, 'utf8', (err, content) => {
              res.writeHead(200, defaultCorsHeaders);
              res.end(content);
            });
          } else { // NOT ARCHIVED
            res.writeHead(404, defaultCorsHeaders);
            res.end('Please come again');
          }
        });
      } else { // NOT IN LIST
        // false: 1) return 404
        //        2) addUrlToList()
        //        3) return loading page
        // archive.addUrlToList(url, ()=>{});
        res.writeHead(404, defaultCorsHeaders);
        res.end('Please come again');
      }
    })
  } else {
    //Initial/Default page request of http://xxx.xxx.xx.xx:8080/
    if (req.method === 'GET') {
      res.writeHead(200, defaultCorsHeaders);
      res.end('/<input/');
    } else {
      let body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        archive.addUrlToList(body.replace('url=', ''), ()=>{
          res.writeHead(302, defaultCorsHeaders);
          res.end();
        });
      })

    }
    // res.end(archive.paths.list);
  }
  //
};
