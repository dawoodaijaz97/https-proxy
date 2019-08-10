const express = require('express');
const https = require('https');
const fs = require('fs');
const http = require("http")
const httpproxy = require("http-proxy")
let Greenlock = require("greenlock-express");
app = express()

var cert2 = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/fullchain.pem", 'utf8')
var key = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/privkey.pem", 'utf8')

console.log(cert2)
console.log(key)

process.env.NODE_TLS_REJECT_UNAUTHORIZED = false

//GET home route
proxy_server = httpproxy.createServer({
    target: "https://instance2mymachines.xyz:9010",
    secure: true,
    ssl: {
        key: key,
        cert: cert2
    }
}).listen(443, function() {
    console.log("Proxy Running : 443")
})
proxy_server.on('proxyRes', function(proxyRes, req, res) {
    console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});


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


Greenlock.create({
        email: "dawood.aijaz97@gmail.com", // The email address of the ACME user / hosting provider
        agreeTos: true, // You must accept the ToS as the host which handles the certs
        configDir: "~/.config/acme/", // Writable directory where certs will be saved
        communityMember: true, // Join the community to get notified of important updates
        telemetry: true, // Contribute telemetry data to the project
        approvedDomains: ["instance2mymachines.xyz", "www.instance2mymachines.xyz"],
        // Using your express app:
        // simply export it as-is, then include it here
        app: app,
        store: require('greenlock-store-fs'),
        server: "https://acme-v02.api.letsencrypt.org/directory",
        //, debug: true
    })
    .listen(80, 9010, function() {
        console.log("GreenLock HTTPS server running on port 9010")
    });