const http = require('http');
const fs = require('fs');

const requestListener = function (req, res) {
  let timestamp = new Date();
  res.setHeader('Content-Type', 'application/json');
  switch (req.url) {
    case '/write':
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          console.log(`${timestamp} - ${req.url} - Got new content, saving to file!`, req.headers);
          res.writeHead(200);
          fs.writeFileSync('/var/www/html/contracts.json', JSON.stringify({ response: body.toString() }));
          res.end(JSON.stringify({ success: 'File successfully updated!' }));
        });
      } else {
        console.log(`${timestamp} - ${req.url} - Invalid request type to /write.`, req.headers);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'POST Requests Only allowed!' }));
      }

      break;
    case '/read':
      console.log(`${timestamp} - ${req.url} - Requesting content, serving up file!`, req.headers);
      res.writeHead(200);
      const data = fs.readFileSync('/var/www/html/contracts.json', 'utf8');
      res.end(data);
      break;
    default:
      console.log(`${timestamp} - ${req.url} - 404 route not found.`, req.headers);
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Resource not found' }));
  }
};

const hostname = '0.0.0.0';
const port = 3004;

const server = http.createServer(requestListener);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
