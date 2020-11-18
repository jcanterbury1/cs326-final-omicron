
'use strict';


// For loading environment variables.
require('dotenv').config();
​
const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy
const app = express();
const port = process.env.PORT || 3000;

​const pgp = require("pg-promise")({
    connect(client) {
        console.log('Connected to database:', client.connectionParameters.database);
    },

    disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }
});

// Local PostgreSQL credentials
const username = "postgres";
const password = "Ryry2249";

const url = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/`;
const db = pgp(url);
const minicrypt = require('./miniCrypt');
const mc = new minicrypt();



const fs = require('fs');
const join = require('path');
const parse = require('url');



const session = {
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave : false,
    saveUninitialized: false
};
​
// Passport configuration
​
const strategy = new LocalStrategy(
    async (username, password, done) => {
	if (!findUser(username)) {
	    // no such user
	    return done(null, false, { 'message' : 'Wrong username' });
	}
	if (!validatePassword(username, password)) {
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
​
​
// App configuration
​
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
​
// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});
​
app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({'extended' : true})); // allow URLencoded data

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

// Returns true iff the user exists.
async function findUser(username) {
    return (await connectAndRun(db => db.none("SELECT * Users WHERE username=($1);", [username]))).length > 1;
}
​
// Returns true iff the password is the one we have stored (in plaintext = bad but easy).
async function validatePassword(name, pwd) {
    if (!findUser(name)) {
	return false;
    }
    if (!mc.check(pwd, users[name][0], users[name][1])) {
	return false;
    }
    return true;
}
​
// Add a user to the "database".
// TODO
async function addUser(name, pwd) {
    if (findUser(name)) {
	return false;
    }
    const [salt, hash] = mc.hash(pwd);
    users[name] = [salt, hash];
    return true;
}
​
// Routes
​
async function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
	// If we are authenticated, run the next route.
	next();
    } else {
	// Otherwise, redirect to the login page.
	res.redirect('/login');
    }
}


// async function userLogin() {
//     return await connectAndRun(db => db.any("SELECT * FROM Users WHERE;"));
// };

// async function addBook(isbn, author, title) {
//     return await connectAndRun(db => db.none("INSERT INTO Books VALUES ($1, $2, $3);", [isbn, author, title]));
// }

app.get('/',
	checkLoggedIn,
	(req, res) => {
	    res.send("hello world");
	});
​
// Handle post data from the login.html form.
app.post('/Ryan/login',
	 passport.authenticate('local' , {     // use username/password authentication
	     'successRedirect' : '/private',   // when we login, go to /private 
	     'failureRedirect' : '/login'      // otherwise, back to login
	 }));
​
// Handle the URL /login (just output the login.html file).
app.get('/login',
	(req, res) => res.sendFile('Ryan/login.html',
				   { 'root' : __dirname }));
​
// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/login'); // back to login
});
​
​
// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
// TODO
app.post('/register',
	 (req, res) => {
	     const username = req.body['username'];
	     const password = req.body['password'];
	     if (addUser(username, password)) {
		 res.redirect('/Ryan/login');
	     } else {
		 res.redirect('/Ryan/register');
	     }
	 });
​
// Register URL
app.get('/register',
	(req, res) => res.sendFile('Ryan/register.html',
				   { 'root' : __dirname }));
​
// Private data
app.get('/private',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	    res.redirect('/private/' + req.user);
	});
​
// A dummy page for the user.
app.get('/private/:userID/',
	checkLoggedIn, // We also protect this route: authenticated...
	(req, res) => {
	    // Verify this is the right user.
	    if (req.params.userID === req.user) {
		res.writeHead(200, {"Content-Type" : "text/html"});
		res.write('<H1>HELLO ' + req.params.userID + "</H1>");
		res.write('<br/><a href="/logout">click here to logout</a>');
		res.end();
	    } else {
		res.redirect('/private/');
	    }
});


// middleware
// app.use(express.static('Ryan'));

app.get('/user/register', (req, res) => {

    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let username = req.body.username;
    let password = minicrypt(req.body.password);
    

    console.log(`Set ${username} to ${password}`);
    res.send('Account created.');
});

app.get('/user/login', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    console.log("User: " +k +" logged in.");
    res.send(`username = ${randomName}, details = ${randomEmail}`);
});


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

app.get('/user/updateUsername', (req, res) => {
    const k = req.params['old_username'];
    datastore[k] = req.params['new_username'];
    console.log("User: " +k +" updated.");
    res.send(`username = ${k}, new_username = ${datastore[k]}`);
});

app.get('/user/deleteAccount', (req, res) => {
    const k = req.params['username'];
    datastore[k] = null;
    console.log("User: " +k +" deleted.");
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

app.get('*', function(req, res) {
    const parsed = parse.parse(req.url, true);
    const filename = parsed.pathname === '/' ? "Ryan/home.html" : parsed.pathname.replace('/', '');
    let path = join.join("", filename);
    console.log("trying to serve " + path + "...");
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
    };
});

app.use(express.static('html'));


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});