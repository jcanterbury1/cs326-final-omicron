"use strict";

const express = require("express");
const parse = require("url");
const join = require("path");
const fs = require("fs");
const faker = require("faker");
const db = require("pg-promise")()(process.env.DATABASE_URL);

const app = express();
app.use(express.json());



// Jason's endpoints
app.get("/getGroceryListings", async (req, res) => {
  res.send(await db.any("select * from grocerylistings order by likes desc;"));
});

app.get("/getGymListings", async (req, res) => {
  res.send(await db.any("select * from gymlistings order by likes desc;"));
});

app.get("/getHousingListings", async (req, res) => {
  res.send(await db.any("select * from housinglistings order by likes desc;"));
});

app.get("/getLaundromatListings", async (req, res) => {
  res.send(await db.any("select * from laundromatlistings order by likes desc;"));
});

app.post("/addGroceryListing", async (req, res) => {
  await db.none("insert into grocerylistings values ($1,$2,$3,$4);", [req.body.name, req.body.address, 3, 0]);
  res.send();
});

app.post("/addGymListing", async (req, res) => {
  await db.none("insert into gymlistings values ($1,$2,$3,$4);", [req.body.name, req.body.address, 0, 0]);
  res.send();
});

app.post("/addHousingListing", async (req, res) => {
  await db.none("insert into housinglistings values ($1,$2,$3,$4);", [req.body.address, req.body.landlord, 0, 0]);
  res.send();
});

app.post("/addLaundromatListing", async (req, res) => {
  await db.none("insert into laundromatlistings values ($1,$2,$3,$4);", [req.body.name, req.body.address, 0, 0]);
  res.send();
});

app.get("/getGroceryReviews", (req, res) => {
  const listings = [];
  const size = Math.floor((Math.random() * 5) + 5);
  for(let i = 0; i < size; i++) {
    listings.push({
      description: "I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store.",
      price: Math.floor((Math.random() * 5) + 1),
      user: faker.internet.userName()
    });
  }
  res.send(listings);
});

app.get("/getGymReviews", (req, res) => {
  const listings = [];
  const size = Math.floor((Math.random() * 5) + 5);
  for(let i = 0; i < size; i++) {
    listings.push({
      description: "I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store.",
      price: Math.floor((Math.random() * 90) + 10),
      user: faker.internet.userName()
    });
  }
  res.send(listings);
});

app.get("/getHousingReviews", (req, res) => {
  const listings = [];
  const size = Math.floor((Math.random() * 5) + 5);
  for(let i = 0; i < size; i++) {
    listings.push({
      description: "I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store.",
      price: Math.floor((Math.random() * 1000) + 500),
      user: faker.internet.userName()
    });
  }
  res.send(listings);
});

app.get("/getLaundromatReviews", (req, res) => {
  const listings = [];
  const size = Math.floor((Math.random() * 5) + 5);
  for(let i = 0; i < size; i++) {
    listings.push({
      description: "I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store. I like this store.",
      price: Math.floor((Math.random() * 5) + 1),
      user: faker.internet.userName()
    });
  }
  res.send(listings);
});

app.post("/addName", async (req, res) => {
  await db.none("delete from name;");
  await db.none("insert into name values ($1);", [req.body.name]);
  res.send();
});

app.get("/getName", async (req, res) => {
  res.send(await db.one("select * from name;"));
});






//   curl -d '{ "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/read/x

app.get('/housing/new', (req, res) => {
  const k = req.query.address;
  const v = req.query.value;
  datastore[k] = v;
  console.log(`Set ${k} to ${v}`);
  res.send('Review Written.');
});
// app.get('/gym/new', (req, res) => {
//   const k = req.query.name;
//   const v = req.query.value;
//   datastore[k] = v;
//   console.log(`Set ${k} to ${v}`);
//   res.send('Review Written.');
// });
// app.get('/grocery/new', (req, res) => {
//   const k = req.query.name;
//   const v = req.query.value;
//   datastore[k] = v;
//   console.log(`Set ${k} to ${v}`);
//   res.send('Review Written.');
// });
// app.get('/laundromat/new', (req, res) => {
//   const k = req.query.name;
//   const v = req.query.value;
//   datastore[k] = v;
//   console.log(`Set ${k} to ${v}`);
//   res.send('Review Written.');
// });
// app.get('/review/new', (req, res) => {
//   const k = req.query.review;
//   const v = req.query.object;
//   datastore[k] = v;
//   console.log(`Set ${k} to ${v}`);
//   res.send('Review Written.');
// });
// app.get('/user/register', (req, res) => {
//   const k = req.query.username;
//   const v = req.query.password;
//   datastore[k] = v;
//   console.log(`Set ${k} to ${v}`);
//   res.send('Account created.');
// });

let randomName = faker.name.findName(); // Rowan Nikolaus
let randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
let randomCard = faker.helpers.createCard(); // random contact card containing many propert
let randomAddress = faker.address.streetAddress();

app.get('/user/login', (req, res) => {
  const k = req.params['username'];
  const v = datastore[k];
  console.log("User: " + k + " logged in.");
  res.send(`username = ${randomName}, details = ${randomEmail}`);
});

app.get('/user/updateUsername', (req, res) => {
  const k = req.params['old_username'];
  datastore[k] = req.params['new_username'];
  console.log("User: " + k + " updated.");
  res.send(`username = ${randomName}, new_username = ${randomEmail}`);
});

app.get('/user/deleteAccount', (req, res) => {
  const k = req.params['username'];
  datastore[k] = null;
  console.log("User: " + k + " deleted.");
  res.send(`username = ${randomName} deleted.`);
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

//changing from get to post
app.get('/writeReview', (req, res) => {
  const k = req.query.name;
  const v = req.query.price;
  const x = req.query.review;
  const z = req.query.category;
  datastore[k] = v;
  console.log(`Set ${k} to ${v}, body = ${JSON.stringify(req.query)}`);
  res.send('Set.');
});

app.get("*", (req, res) => {
  const parsed = parse.parse(req.url, true);
  const filename = parsed.pathname === "/" ? "Ryan/login.html" : parsed.pathname.replace("/", "");
  const path = join.join("", filename);
  if(fs.existsSync(path)) {
    if(filename.endsWith("html")) {
      res.writeHead(200, { "Content-Type": "text/html" });
    } else if(filename.endsWith("css")) {
      res.writeHead(200, { "Content-Type": "text/css" });
    } else if(filename.endsWith("js")) {
      res.writeHead(200, { "Content-Type": "text/javascript" });
    } else {
      res.writeHead(200);
    }
    res.write(fs.readFileSync(path));
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});

app.listen(process.env.PORT || 8000);