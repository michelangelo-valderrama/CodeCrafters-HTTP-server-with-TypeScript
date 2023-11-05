const net = require("node:net")
const fs = require("node:fs/promises")

const {
  parseRequest,
  setBody,
  setEmpty,
  setHeader,
  setStatus,
} = require("./utils")
const { HTTP_STATUS } = require("./consts")

const server = net.createServer((socket) => {
  console.log(`[client] connected.`)

  socket.on("data", async (data) => {
    const { path, headers } = parseRequest(data)

    if (path === "/") {
      socket.write(setStatus(HTTP_STATUS.OK))
      socket.write(setEmpty())
    } else if (path.includes("/echo")) {
      const [, body] = path.match(/\/echo\/(.+)/)
      socket.write(setStatus(HTTP_STATUS.OK))
      socket.write(setHeader("Content-Type", "text/plain"))
      socket.write(setBody(body))
    } else if (path === "/user-agent") {
      socket.write(setStatus(HTTP_STATUS.OK))
      socket.write(setHeader("Content-Type", "text/plain"))
      socket.write(setBody(headers["User-Agent"]))
    } else if (path.includes("/files")) {
      try {
        const [, fileName] = path.match(/\/files\/(.+)/)
        const dirPatch = process.argv[3]
        const fileContent = await fs.readFile(`${dirPatch}/${fileName}`, {
          encoding: "utf-8",
        })
        socket.write(setStatus(HTTP_STATUS.OK))
        socket.write(setHeader("Content-Type", "text/plain"))
        socket.write(setBody(fileContent))
      } catch (error) {
        socket.write(setStatus(HTTP_STATUS.NOT_FOUND))
        socket.write(setEmpty())
      }
    } else {
      socket.write(setStatus(HTTP_STATUS.NOT_FOUND))
      socket.write(setEmpty())
    }
    socket.end()
  })
  socket.on("close", () => {
    socket.end()
  })
})

server.listen(4221, "localhost")
