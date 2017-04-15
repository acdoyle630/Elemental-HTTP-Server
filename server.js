/*jshint esversion: 6*/

const http = require('http');

const server = http.createServer((req, res)  => {
  console.log(req.method);
  res.end('ended');

});

server.listen(6969, () => {
  console.log('server');
});