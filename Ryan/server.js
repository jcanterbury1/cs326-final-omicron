'use strict';
const express = require('express');
const app = express();
app.use(express.json()); // lets you handle JSON input
const port = 3000;
let datastore = {};
let faker = require('faker');

app.get('/', (req, res) => {
  res.send('System Working!')
});
//   curl -d '{ "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/read/x
app.get('/housing/new', (req, res) => {
    const k = req.query.key;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Set.');
});
app.get('/gym/new', (req, res) => {
    const k = req.query.key;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Set.');
});
app.get('/grocery/new', (req, res) => {
    const k = req.query.key;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Set.');
});
app.get('/laundromat/new', (req, res) => {
    const k = req.query.key;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Set.');
});
app.get('/review/new', (req, res) => {
    const k = req.query.key;
    const v = req.query.value;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Set.');
});
app.get('/user/register', (req, res) => {
    const k = req.query.key;
    const v = req.query.value;
    datastore[k] = v;  
    console.log(`Set ${k} to ${v}`);
    res.send('Set.');
});
// app.get('/user/login', (req, res) => {
//     const k = req.params['key'];
//     const v = datastore[k];
//     res.send(`key = ${k}, value = ${v}`);
// });

let randomName = faker.name.findName(); // Rowan Nikolaus
let randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
let randomCard = faker.helpers.createCard(); // random contact card containing many propert

app.get('/search/:key', (req, res) => {
    const k = req.params['key'];
    const v = datastore[k];
    res.send(`key = ${k}, value = ${randomName, randomEmail, randomCard}`);
    // console.log(randomName, randomEmail, randomCard);
});
app.get('/reviews/:key', (req, res) => {
    const k = req.params['key'];
    const v = datastore[k];
    res.send(`key = ${k}, value = ${randomName, randomEmail, randomCard}`);
});
// app.get('/read', (req, res) => {
//     const k = req.query.key;
//     const v = datastore[k];
//     res.send(`key = ${k}, value = ${v}`);
// });
// app.get('/read/:key', (req, res) => {
//     const k = req.params['key'];
//     const v = datastore[k];
//     res.send(`key = ${k}, value = ${v}`);
// });
//   curl -d '{ "key" : "x", "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/pcreate
app.post('/pcreate', (req, res) => {
    const k = req.body["key"];
    const v = req.body["value"];
    datastore[k] = v;
    console.log(`Set ${k} to ${v}, body = ${JSON.stringify(req.body)}`);
    res.send('Set.');
});
app.get('*', (req, res) => {
    res.send('NO FOOL');
});
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});