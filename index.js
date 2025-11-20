const http = require('http');

const PORT = 3000;
const HOST = '0.0.0.0';   // IMPORTANT: ECS needs this

const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello from CI/CD Pipeline with Jenkins + Docker + AWS!");
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
