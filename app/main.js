const net = require("node:net")

const HTTP_STATUS = {
  OK: [200, "OK"],
  NOT_FOUND: [404, "Not Found"],
}

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

const setEmpty = () => "\r\n"
const setStatus = (status) => `HTTP/1.1 ${status.join(" ")}\r\n`
const setHeader = (key, value) => `${key}: ${value}\r\n`
const setBody = (content) =>
  `${setHeader("Content-Length", content.length)}${setEmpty()}${content}`

const server = net.createServer((socket) => {
  console.log(`[client] connected.`)
  socket.on("data", (data) => {
    const { path } = parseRequest(data)
    if (path === "/") {
      socket.write(setStatus(HTTP_STATUS.OK))
      socket.write(setEmpty())
    } else if (path.includes("/echo")) {
      const [, body] = path.match(/\/echo\/(.+)/)
      socket.write(setStatus(HTTP_STATUS.OK))
      socket.write(setHeader("Content-Type", "text/plain"))
      socket.write(setBody(body))
    } else {
      socket.write(setStatus(HTTP_STATUS.NOT_FOUND))
      socket.write(setEmpty())
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
