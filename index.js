const express = require('express');
const https = require('https');
const fs = require('fs');
const http = require("http")
const httpproxy = require("http-proxy")
app = express()

var cert = fs.readFileSync(__dirname + "/certsFiles/NewCert.pfx", "utf-8");
var cert2 = fs.readFileSync(__dirname + "/certsFiles/selfsigned.crt", 'utf8')
var key = fs.readFileSync(__dirname + "/certsFiles/selfsigned.key", 'utf8')

console.log(cert2)
console.log(key)

var credentials = {
    pfx: cert,
    passphrase: "google"

};

//GET home route
proxy_server = httpproxy.createServer({
    target: {
        protocol: "https",
        host: "www.instance2mymachines.com",
        port: 443,
        pfx: fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/cert_key.p12"),
        passphrase: "google"
    },
    changeOrigin: true
}).listen(8000, function() {
    console.log("Proxy Running : 8000")
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

var https_server = https.createServer(credentials, app);


https_server.listen(443, () => {
    console.log("Https server listing on port : 443")
});