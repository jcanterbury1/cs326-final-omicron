



'use strict';

// For loading environment variables.
require('dotenv').config();

const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy
const app = express();
const port = process.env.PORT || 3000;
const minicrypt = require('../client/miniCrypt');
let path = require('path');


const mc = new minicrypt();


//DATABASE CONNECTION
const pgp = require("pg-promise")({
    connect(client) {
        console.log('Connected to database:', client.connectionParameters.database);
    },

    disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }
});

const url = process.env.DATABASE_URL;
const db = pgp(url);

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
//------------------------------------------

// Session configuration

const session = {
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave : false,
    saveUninitialized: false
};

// Passport configuration

const strategy = new LocalStrategy(
    async (username, password, done) => {
	if (!(await findUser(username))) {
	    // no such user
	    return done(null, false, { 'message' : 'Wrong username' });
	}
	if (!(await validatePassword(username, password))) {
	    // invalid password
	    // should disable logins after N messages
	    // delay return to rate-limit brute-force attacks
	    await new Promise((r) => setTimeout(r, 2000)); // two second delay
	    return done(null, false, { 'message' : 'Wrong password' });
	}
	// success!
	// should create a user object here, associated with a unique identifier
	return done(null, username);
    });


// App configuration

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('client')); // For serving CSS & JS to websites


// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({'extended' : false})); // allow URLencoded data

/////

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
    let fetch = await connectAndRun(db => db.any("SELECT password, salt FROM Users WHERE username=($1);", [name]));
    if (!mc.check(pwd, fetch[0].salt, fetch[0].password)) {
	return false;
    }
    return true;
}

// Add a user to the "database".

async function addUser(first, last, name, pwd) {
    if (await findUser(name)) {
	return false;
    }
    const [salt, hash] = mc.hash(pwd);
    console.log(salt);
    await connectAndRun(db => db.none("INSERT INTO Users VALUES ($1, $2, $3, $4, $5);", [first, last, name, hash, salt]));
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

app.get('/',
	checkLoggedIn,
	(req, res) => {
	    res.send("hello world");
	});

// Handle post data from the login.html form.
app.post('/login',
	 passport.authenticate('local' , {     // use username/password authentication
	     'successRedirect' : '/home',   // when we login, go to /private 
	     'failureRedirect' : '/login'      // otherwise, back to login
	 }));

// Handle the URL /login (just output the login.html file).
app.get('/login',
	(req, res) => res.sendFile(path.join(__dirname, '../client', 'login.html')));

// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/login'); // back to login
});

app.post('/register',
	 async(req, res) => {
	     const username = req.body['username'];
		 const password = req.body['password'];
		 const first = req.body['first'];
		 const last = req.body['last'];
	     if (await addUser(first, last, username, password)) {
		 res.redirect('/login');
	     } else {
		 res.redirect('/register');
	     }
	 });

// Register URL
app.get('/register', checkNotLoggedIn,
  async(req, res) => res.sendFile(path.join(__dirname, '../client', 'create.html')));
  
// Private data
app.get('/home',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'home.html'));
	});

app.get('/housing-listings',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'housing-listings.html'));
});

app.get('/grocery-listings',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'grocery-listings.html'));
});

app.get('/laundromat-listings',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'laundromat-listings.html'));
});

app.get('/gym-listings',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'gym-listings.html'));
});
//Nadia's write-review gets
app.get('/write-grocery-review',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'grocery-write-review.html'));
});
app.get('/write-gym-review',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'gym-write-review.html'));
});
app.get('/write-housing-review',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'housing-write-review.html'));
});
app.get('/write-laundromat-review',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	res.sendFile(path.join(__dirname, '../client', 'laundromat-write-review.html'));
});
//Nadia's endpoints
app.post("/write-grocery-review", checkLoggedIn, async (req, res) => {
  await db.none("insert into reviews values ($1,$2,$3,$4);", [req.body.category, req.body.name, req.body.review, req.body.price]);
  res.send();
});

app.post("/write-gym-review", checkLoggedIn, async (req, res) => {
  await db.none("insert into reviews values ($1,$2,$3,$4);", [req.body.category, req.body.name, req.body.review, req.body.price]);
  res.send();
});

app.post("/write-housing-review", checkLoggedIn, async (req, res) => {
  await db.none("insert into reviews values ($1,$2,$3,$4);", [req.body.category, req.body.name, req.body.review, req.body.price]);
  res.send();
});

app.post("/write-laundromat-review", checkLoggedIn, async (req, res) => {
  await db.none("insert into reviews values ($1,$2,$3,$4);", [req.body.category, req.body.name, req.body.review, req.body.price]);
  res.send();
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
  await db.none("insert into grocerylistings values ($1,$2,$3,$4);", [req.body.name, req.body.address, 3, 0]);
  res.send();
});

app.post("/addGymListing", checkLoggedIn, async (req, res) => {
  await db.none("insert into gymlistings values ($1,$2,$3,$4);", [req.body.name, req.body.address, 0, 0]);
  res.send();
});

app.post("/addHousingListing", checkLoggedIn, async (req, res) => {
  await db.none("insert into housinglistings values ($1,$2,$3,$4);", [req.body.address, req.body.landlord, 0, 0]);
  res.send();
});

app.post("/addLaundromatListing", checkLoggedIn, async (req, res) => {
  await db.none("insert into laundromatlistings values ($1,$2,$3,$4);", [req.body.name, req.body.address, 0, 0]);
  res.send();
});

app.get("/getGroceryReviews", checkLoggedIn, (req, res) => {
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

app.get("/getGymReviews", checkLoggedIn, (req, res) => {
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

app.get("/getHousingReviews", checkLoggedIn, (req, res) => {
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

app.get("/getLaundromatReviews", checkLoggedIn, (req, res) => {
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

app.post("/addName", checkLoggedIn, async  (req, res) => {
  await db.none("delete from name;");
  await db.none("insert into name values ($1);", [req.body.name]);
  res.send();
});

app.get("/getName", checkLoggedIn, async (req, res) => {
  res.send(await db.one("select * from name;"));
});



app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client', 'login.html'));
});

app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});