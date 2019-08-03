const express = require('express');
const https = require('https');
const fs = require('fs');
const http = require("http")
const httpproxy = require("http-proxy")
app = express()

var cert = fs.readFileSync(__dirname + '/certsFiles/NewCert.pfx');
var cert2 = fs.readFileSync(__dirname + '/certsFiles/selfsigned.crt', "utf-8");
var key = fs.readFileSync(__dirname + '/certsFiles/selfsigned.key', "utf-8")


var credentials = {
    pfx: cert,
    passphrase: "google"
};

//GET home route
proxy_server = httpproxy.createServer({
    target: "https://10.128.0.3:9001",
    secure: true,
    ssl: {
        key: key,
        cert: cert2
    }
}).listen(443, function() {
    console.log("Proxy Running : 443")
})

app.use(function(req, res) {

    console.log(JSON.stringify(req.headers.host))
    host = req.hostname
    console.log(host)
    try {
        proxy_server.web(req, res, {
            target: "https://" + req.hostname
        });
    } catch (e) {
        console.error(e)
    }
});

app.get('/', (req, res) => {
    res.send('Hello World.');
});

var http_server = https.createServer(credentials, app);


https_server.listen(9001, () => {
    console.log("Https server listing on port : 9001")
});