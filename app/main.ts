import { createServer } from "node:net"
import { readFile, writeFile } from "node:fs/promises"
import { parseRequest, setBody, setEmpty, setHeader, setStatus } from "./utils"
import { HTTP_STATUS } from "./consts"

const PORT = process.env.PORT ?? 3000
const HOST = "localhost"

const server = createServer((socket) => {
  console.log(`[client] connected.`)
  socket.on("data", async (data) => {
    const { method, path, headers, body } = parseRequest(data)
    if (path === "/") {
      socket.write(setStatus(HTTP_STATUS.OK))
      socket.write(setEmpty())
    } else if (path.includes("/echo")) {
      const [, body] = path.match(/\/echo\/(.+)/) as string[]
      socket.write(setStatus(HTTP_STATUS.OK))
      socket.write(setHeader("Content-Type", "text/plain"))
      socket.write(setBody(body))
    } else if (path === "/user-agent") {
      socket.write(setStatus(HTTP_STATUS.OK))
      socket.write(setHeader("Content-Type", "text/plain"))
      socket.write(setBody(headers["User-Agent"] ?? ""))
    } else if (path.includes("/files")) {
      const dirPatch = process.argv[3]
      const [, fileName] = path.match(/\/files\/(.+)/) as string[]
      const filePath = `${dirPatch}/${fileName}`
      if (method === "GET") {
        try {
          const fileContent = await readFile(filePath, {
            encoding: "utf-8",
          })
          socket.write(setStatus(HTTP_STATUS.OK))
          socket.write(setHeader("Content-Type", "application/octet-stream"))
          socket.write(setBody(fileContent))
        } catch (error) {
          socket.write(setStatus(HTTP_STATUS.NOT_FOUND))
          socket.write(setEmpty())
        }
      }
      if (method === "POST") {
        try {
          const data = new Uint8Array(Buffer.from(body))
          await writeFile(filePath, data)
          socket.write(setStatus(HTTP_STATUS.CREATED))
          socket.write(setEmpty())
        } catch (error) {
          socket.write(setStatus(HTTP_STATUS.NOT_FOUND))
          socket.write(setEmpty())
        }
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

server.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`)
})
