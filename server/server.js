"use strict";

require("dotenv").config();
const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const minicrypt = require("../client/miniCrypt");
const mc = new minicrypt();
const path = require("path");
const db = require("pg-promise")()(process.env.DATABASE_URL);

const session = {
  secret: process.env.SECRET || "SECRET",
  resave: false,
  saveUninitialized: false
};

const strategy = new LocalStrategy(async (username, password, done) => {
  if(!(await findUser(username))) {
    return done(null, false, { "message": "Wrong username" });
  }
  if(!(await validatePassword(username, password))) {
    await new Promise((r) => setTimeout(r, 2000));
    return done(null, false, { "message": "Wrong password" });
  }
  return done(null, username);
});

async function connectAndRun(task) {
  let connection = null;

  try {
      connection = await db.connect();
      return await task(connection);
  } catch (e) {
      throw e;
  } finally {
      try {
          connection.done();
      } catch(ignored) {

      }
  }
}

const app = express();
app.listen(process.env.PORT);
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("client"));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((uid, done) => {
  done(null, uid);
});
app.use(express.json());
app.use(express.urlencoded({ "extended": false }));





//Ryan's endpoints and functions

// Returns true iff the user exists.
async function findUser(username) {
  return (await connectAndRun(db => db.any("SELECT * FROM Users WHERE username=($1);", [username]))).length === 1;
}

// Returns true iff the password is the one we have stored (in plaintext = bad but easy).
async function validatePassword(name, pwd) {
  if (!(await findUser(name))) {
return false;
  }
  let fetch = await connectAndRun(db => db.any("SELECT hash, salt FROM Users WHERE username=($1);", [name]));
  if (!mc.check(pwd, fetch[0].salt, fetch[0].hash)) {
return false;
  }
  return true;
}

// Add a user to the "database".

async function addUser(name, pwd) {
  if (await findUser(name)) {
return false;
  }
  const [salt, hash] = mc.hash(pwd);
  console.log(salt);
  await connectAndRun(db => db.none("INSERT INTO Users VALUES ($1, $2, $3);", [name, hash, salt]));
  return true;
}

// Routes

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
// If we are authenticated, run the next route.
next();
  } else {
// Otherwise, redirect to the login page.
res.redirect('/login');
  }
}

function checkNotLoggedIn(req, res, next) {
if (!req.isAuthenticated()) {
// If we are authenticated, run the next route.
next();
} else {
// Otherwise, redirect to the login page.
res.redirect('/home');
}
}

app.post("/login", passport.authenticate("local", {
  "successRedirect": "/home",
  "failureRedirect": "/login"
}));

app.post("/register", async (req, res) => {
  if(await addUser(req.body.username, req.body.password)) {
    res.redirect("/login");
  } else {
    res.redirect("/register");
  }
});

app.post("/delete", async (req, res) => {
  if(await validatePassword(req.body.username, req.body.password)) {
    await db.none("delete from users where username=($1);", req.body.username);
    await db.none("delete from likes where username=($1);", req.body.username);
    res.redirect("/login");
  } else {
    res.redirect("/delete");
  }
});




//Nadia's endpoint
app.post("/writeReview", checkLoggedIn, async (req, res) => {
  res.send(await db.none("insert into reviews values ($1,$2,$3,$4,$5);", [req.body.category, req.body.id, req.body.description, req.body.price, req.body.username]));
});




// Jason's endpoints
app.get("/getGroceryListings", checkLoggedIn, async (req, res) => {
  res.send(await db.any("select * from grocerylistings order by likes desc;"));
});

app.get("/getGymListings", checkLoggedIn, async (req, res) => {
  res.send(await db.any("select * from gymlistings order by likes desc;"));
});

app.get("/getHousingListings", checkLoggedIn, async (req, res) => {
  res.send(await db.any("select * from housinglistings order by likes desc;"));
});

app.get("/getLaundromatListings", checkLoggedIn, async (req, res) => {
  res.send(await db.any("select * from laundromatlistings order by likes desc;"));
});

app.post("/addGroceryListing", checkLoggedIn, async (req, res) => {
  if((await db.any("select * from grocerylistings where name=($1) and address=($2);", [req.body.name, req.body.address])).length === 0) {
    await db.none("insert into grocerylistings values ($1,$2,$3);", [req.body.name, req.body.address, 0]);
    const s = ("grocery " + req.body.name + " " + req.body.address).split(" ").join("");
    await db.none("alter table likes add " + s + " boolean default false;");
  }
  res.send();
});

app.post("/addGymListing", checkLoggedIn, async (req, res) => {
  if((await db.any("select * from gymlistings where name=($1) and address=($2);", [req.body.name, req.body.address])).length === 0) {
    await db.none("insert into gymlistings values ($1,$2,$3);", [req.body.name, req.body.address, 0]);
    const s = ("gym " + req.body.name + " " + req.body.address).split(" ").join("");
    await db.none("alter table likes add " + s + " boolean default false;");
  }
  res.send();
});

app.post("/addHousingListing", checkLoggedIn, async (req, res) => {
  if((await db.any("select * from housinglistings where address=($1) and landlord=($2);", [req.body.address, req.body.landlord])).length === 0) {
    await db.none("insert into housinglistings values ($1,$2,$3);", [req.body.address, req.body.landlord, 0]);
    const s = ("housing " + req.body.address + " " + req.body.landlord).split(" ").join("");
    await db.none("alter table likes add " + s + " boolean default false;");
  }
  res.send();
});

app.post("/addLaundromatListing", checkLoggedIn, async (req, res) => {
  if((await db.any("select * from laundromatlistings where name=($1) and address=($2);", [req.body.name, req.body.address])).length === 0) {
    await db.none("insert into laundromatlistings values ($1,$2,$3);", [req.body.name, req.body.address, 0]);
    const s = ("laundromat " + req.body.name + " " + req.body.address).split(" ").join("");
    await db.none("alter table likes add " + s + " boolean default false;");
  }
  res.send();
});

app.post("/getGroceryReviews", checkLoggedIn, async (req, res) => {
  res.send(await db.any("select * from reviews where category='grocery' and id=($1);", [req.body.name + "|" + req.body.address]));
});

app.post("/getGymReviews", checkLoggedIn, async (req, res) => {
  res.send(await db.any("select * from reviews where category='gym' and id=($1);", [req.body.name + "|" + req.body.address]));
});

app.post("/getHousingReviews", checkLoggedIn, async (req, res) => {
  res.send(await db.any("select * from reviews where category='housing' and id=($1);", [req.body.address + "|" + req.body.landlord]));
});

app.post("/getLaundromatReviews", checkLoggedIn, async (req, res) => {
  res.send(await db.any("select * from reviews where category='laundromat' and id=($1);", [req.body.name + "|" + req.body.address]));
});

app.post("/getPrice", checkLoggedIn, async (req, res) => {
  let avg = {};
  if((await db.any("select * from reviews where category=($1) and id=($2)", [req.body.category, req.body.id])).length !== 0) {
    avg = await db.one("select avg(price) from reviews where category=($1) and id=($2)", [req.body.category, req.body.id]);
    avg.avg = parseInt(avg.avg);
  } else {
    if(req.body.category === "grocery") {
      avg.avg = 3;
    } else {
      avg.avg = 0;
    }
  }
  res.send(avg);
});

app.get("/getTrending", checkLoggedIn, async (req, res) => {
  const listings = [];
  listings.push(await db.any("select * from housinglistings order by likes desc limit 1;"));
  listings.push(await db.any("select * from grocerylistings order by likes desc limit 1;"));
  listings.push(await db.any("select * from laundromatlistings order by likes desc limit 1;"));
  listings.push(await db.any("select * from gymlistings order by likes desc limit 1;"));
  res.send(listings);
});

app.post("/likeListing", checkLoggedIn, async (req, res) => {
  const updatedLikes = {};
  let likes;
  if(req.body.category === "housing") {
    likes = (await db.one("select likes from " + req.body.category + "listings where address=($1)", [req.body.address])).likes;
  } else {
    likes = (await db.one("select likes from " + req.body.category + "listings where name=($1)", [req.body.name])).likes;
  }
  if((await db.one("select " + req.body.category + req.body.id + " from likes where username=($1);", [req.body.username]))[req.body.category + req.body.id] === false) {
    await db.none("update likes set " + req.body.category + req.body.id + "=true where username=($1)", [req.body.username]);
    if(req.body.category === "housing") {
      await db.none("update " + req.body.category + "listings set likes=($1) where address=($2)", [likes + 1, req.body.address]);
    } else {
      await db.none("update " + req.body.category + "listings set likes=($1) where name=($2)", [likes + 1, req.body.name]);
    }
    updatedLikes.result = likes + 1;
  } else {
    updatedLikes.result = likes;
  }
  res.send(updatedLikes);
});




// redirecting endpoints
app.get("/login", checkNotLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "login.html"));
});

app.get("/logout", checkLoggedIn, (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.get("/register", checkNotLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "create.html"));
});

app.get("/delete", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "delete.html"));
});

app.get("/home", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "home.html"));
});

app.get("/grocery-listings", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "grocery-listings.html"));
});

app.get("/gym-listings", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "gym-listings.html"));
});

app.get("/housing-listings", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "housing-listings.html"));
});

app.get("/laundromat-listings", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "laundromat-listings.html"));
});

app.get("/grocery-new-listing", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "grocery-new-listing.html"));
});

app.get("/gym-new-listing", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "gym-new-listing.html"));
});

app.get("/housing-new-listing", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "housing-new-listing.html"));
});

app.get("/laundromat-new-listing", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "laundromat-new-listing.html"));
});

app.get("/grocery-read-reviews", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "grocery-read-reviews.html"));
});

app.get("/gym-read-reviews", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "gym-read-reviews.html"));
});

app.get("/housing-read-reviews", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "housing-read-reviews.html"));
});

app.get("/laundromat-read-reviews", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "laundromat-read-reviews.html"));
});

app.get("/grocery-write-review", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "grocery-write-review.html"));
});

app.get("/gym-write-review", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "gym-write-review.html"));
});

app.get("/housing-write-review", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "housing-write-review.html"));
});

app.get("/laundromat-write-review", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "laundromat-write-review.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "login.html"));
});