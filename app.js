const express = require('express');
app = express()
app.use(function(req, res) {
    console.log("Inside HTTPS Server")
    console.log(JSON.stringify(req.headers.host))
    host = req.hostname
    console.log(host)
    try {
        proxy_server.web(req, res, {
            target: "https://" + req.hostname,
        });
    } catch (e) {
        console.error(e)
    }
});

app.get('/', (req, res) => {
    res.send('Hello World.');
});


module.exports = app