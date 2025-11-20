const http = require('http');

const PORT = 3000;
const HOST = '0.0.0.0';   

const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("1111111111111111111 shasmitha Pipeline with Jenkins + Docker + AWS!");
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
