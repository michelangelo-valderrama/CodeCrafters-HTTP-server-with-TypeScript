export const parseRequest = (rawRequest: Buffer) => {
  const requestStr = rawRequest.toString()
  const splitedReq = requestStr.split(/\r?\n/)
  const startLine = splitedReq.shift()!.split(" ")
  const indexEmptyLine = splitedReq.findIndex((_, i, arr) => arr[i] === "")
  const headersArr = splitedReq.splice(0, indexEmptyLine)
  const headers: { [key: string]: string } = {}
  headersArr.map((v) => {
    const [key, value] = v.split(": ")
    headers[key] = value
  })
  const [, ...body] = splitedReq
  return {
    method: startLine[0],
    path: startLine[1],
    version: startLine[2],
    headers,
    body: body.join(""),
  }
}
