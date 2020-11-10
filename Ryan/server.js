
'use strict';
const express = require('express');
const app = express();
app.use(express.json()); // lets you handle JSON input
const port = 3000;
let datastore = {};

const fs = require('fs');
const join = require('path');
const parse = require('url');
let faker = require('faker');

//   curl -d '{ "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/read/x

app.get('/housing/new', (req, res) => {
    const k = req.query.address;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Review Written.');
});
app.get('/gym/new', (req, res) => {
    const k = req.query.name;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Review Written.');
});
app.get('/grocery/new', (req, res) => {
    const k = req.query.name;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Review Written.');
});
app.get('/laundromat/new', (req, res) => {
    const k = req.query.name;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Review Written.');
});
app.get('/review/new', (req, res) => {
    const k = req.query.review;
    const v = req.query.object;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Review Written.');
});
app.get('/user/register', (req, res) => {
    const k = req.query.username;
    const v = req.query.password;
    datastore[k] = v;  
    console.log(`Set ${k} to ${v}`);
    res.send('Account created.');
});

let randomName = faker.name.findName(); // Rowan Nikolaus
let randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
let randomCard = faker.helpers.createCard(); // random contact card containing many propert
let randomAddress = faker.address.streetAddress();

app.get('/user/login', (req, res) => {
    const k = req.params['username'];
    const v = datastore[k];
    res.send(`username = ${k}, details = ${randomName, randomEmail}`);
});

app.get('/search/:item', (req, res) => {
    const k = req.params['name'];
    const v = datastore[k];
    res.send(`item = ${k}, value = ${randomCard}`);
});
app.get('/reviews/:item', (req, res) => {
    const k = req.params['name'];
    const v = datastore[k];
    res.send(`item = ${k}, reviews = ${randomCard}`);
});

app.get('*',function(req,res) {
    const parsed = parse.parse(req.url, true);
    const filename = parsed.pathname === '/' ? "Ryan/home.html" : parsed.pathname.replace('/', '');
        let path = join.join("", filename);
        console.log("trying to serve " + path + "...");
        if (fs.existsSync(path)) {
            if (filename.endsWith("html")) {
                res.writeHead(200, {"Content-Type" : "text/html"});
            } else if (filename.endsWith("css")) {
                res.writeHead(200, {"Content-Type" : "text/css"});
            } else if (filename.endsWith("js")) {
                res.writeHead(200, {"Content-Type" : "text/javascript"});
            } else {
                res.writeHead(200);
            }

            res.write(fs.readFileSync(path));
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        };
  });
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});