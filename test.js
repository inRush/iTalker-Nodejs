// addMethod
'use strict';
const http = require('http');

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello');
  })
  .listen(9000, '127.0.0.1');
console.log('server is start at port 9000');
