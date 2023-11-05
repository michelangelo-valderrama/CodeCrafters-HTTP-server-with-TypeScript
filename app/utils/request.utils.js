const parseRequest = (rawRequest) => {
  const requestStr = rawRequest.toString()
  const splitedReq = requestStr.split(/\r?\n/)
  const startLine = splitedReq.shift().split(" ")
  const indexEmptyLine = splitedReq.findIndex(
    (_, i, arr) => arr[i] === "" && arr[i + 1] === ""
  )
  const headersArr = splitedReq.splice(0, indexEmptyLine)
  const headers = {}
  headersArr.map((v) => {
    const [key, value] = v.split(": ")
    headers[key] = value
  })
  return {
    method: startLine[0],
    path: startLine[1],
    version: startLine[2],
    headers,
  }
}

module.exports = { parseRequest }
