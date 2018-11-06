const http = require('http')

const server = http.createServer((req, res) => {
    console.log(req, res);
})

server.listen(3000, () => console.log('server started on port 3000'))