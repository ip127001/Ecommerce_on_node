const fs = require('fs')

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>')
        res.write('<head><title>Message</title></head>')
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
        res.write('</html>')
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        })

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[0];
            fs.writeFile('message.txt', message, err => {
                //
            });
            console.log(message)
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();

            // const hey = "mera nam hai rohit";
            // const result = hey.split(" ");
            // console.log(result);
        })

    }

    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>My First Page</title></head>')
    res.write('<body><h1>Response from Node.js server</h1></body>')
    res.write('</html>')
    res.end();
}

// module.exports = requestHandler;

// module.exports = {
//     handler : requestHandler,
//     someText: 'some hard text'
// };

exports.handler = requestHandler;
exports.someText = 'some hard text';