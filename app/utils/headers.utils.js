const setEmpty = () => "\r\n"
const setStatus = (status) => `HTTP/1.1 ${status.join(" ")}\r\n`
const setHeader = (key, value) => `${key}: ${value}\r\n`
const setBody = (content) =>
  `${setHeader("Content-Length", content.length)}${setEmpty()}${content}`

module.exports = {
  setEmpty,
  setStatus,
  setHeader,
  setBody,
}
