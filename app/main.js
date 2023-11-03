const net = require("node:net")

const server = net.createServer((socket) => {
  socket.on("data", () => {
    socket.write("HTTP/1.1 200 OK\r\n\r\n")
    socket.end()
    server.close()
  })
  socket.on("close", () => {
    socket.end()
    server.close()
  })
})

server.listen(4221, "localhost")
