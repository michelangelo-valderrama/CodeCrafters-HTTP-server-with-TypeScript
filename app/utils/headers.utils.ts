import { HttpStatus } from "../consts"

export const setEmpty = () => "\r\n"
export const setStatus = (status: HttpStatus) =>
  `HTTP/1.1 ${status.join(" ")}\r\n`
export const setHeader = (key: string, value: string | number) =>
  `${key}: ${value}\r\n`
export const setBody = (content: string) =>
  `${setHeader("Content-Length", content.length)}${setEmpty()}${content}`
