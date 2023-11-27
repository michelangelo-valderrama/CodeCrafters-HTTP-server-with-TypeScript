
# HTTP server with TypeScript
[CodeCrafters](https://app.codecrafters.io/): [Build your own HTTP server](https://app.codecrafters.io/courses/http-server). Learn about TCP servers, the HTTP protocol and more.

```bash
npm run start

curl -v -X GET http://localhost:4221/echo/hello/world
# hello world

curl -v -X GET http://localhost:4221/user-agent
# curl/7.81.0
```

```bash
npm run start:dir

curl -v -X POST http://localhost:3000/files/greet.txt -d "hello"

curl -v -X GET http://localhost:3000/files/greet.txt
# hello
```
