import { Socket } from "net"
import { HttpStatus } from "../consts"
import { setBody, setStatus } from "./headers.utils"

export const writeHead = (socket: Socket, status: HttpStatus) => {
  socket.write(setStatus(status))
}

export const endSocket = (socket: Socket, body: string) => {
  socket.write(setBody(body))
  socket.end()
}
