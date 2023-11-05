const net = require("node:net")

function parseRequest(rawRequest) {
  const requestStr = rawRequest.toString()
  const split = requestStr.split(/\r?\n/)
  const startLine = split[0].split(" ")
  return {
    method: startLine[0],
    path: startLine[1],
    version: startLine[2],
  }
}

function createHTTPResponse({ status, headers, body }) {
  const formattedHeaders = headers.join("\r\n")
  return `HTTP/1.1 ${status}\r\n${formattedHeaders}\r\n${body}\r\n\r\n`
}

const server = net.createServer((socket) => {
  console.log(`[client] connected.`)
  socket.on("data", (data) => {
    const { path } = parseRequest(data)

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n")
    } else if (path.includes("/echo")) {
      const [, body] = path.match(/\/echo\/(.+)/)
      const headers = [
        "Content-Type: text/plain",
        `Content-Length: ${body.length}`,
      ]
      socket.write(
        createHTTPResponse({
          status: "200 OK",
          headers,
          body,
        }),
        "utf-8"
      )
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
    }

    socket.end()
    server.close()
  })
  socket.on("close", () => {
    socket.end()
    server.close()
  })
})

server.listen(4221, "localhost")
