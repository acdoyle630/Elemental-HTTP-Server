/*jshint esversion: 6*/

const http = require('http');
const fs = require('fs');




const server = http.createServer((req, res)  => {

  let method = req.method;
  let url = req.url;
  let host = req.host;
  if(url ==='/' || url ===''){
    url = 'index.html';
  }
  console.log(url);


  if(method === 'GET'){
  var fileName = fs.readFile(`./public/${url}`,(err, data) => {
    //if (err) throw err;
    res.writeHead(200);
    res.end(data);
    });
  }
});


server.listen(6969, () => {
  console.log('server');
});

