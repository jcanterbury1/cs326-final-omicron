Data Flow

User - first, last, email, username, password, likes

Gym - name, address, membership_cost, rating, likes

Housing- ratings, landlord, monthly_rent, monthly_util, address, likes

Laundromats/Grocery - name, address, pricing, ratings, likes

Review - type, address, price, review


CRUD
/user/register - allows new user to register a new account

/user/login - allows user to log in

/housing/new -  create a new listing for housing

/gym/new -  create a new listing for a gym

/laundromat/new - create a new listing for a laundromat

/grocery/new -  create a new listing for a grocery store

/reviews/new - create a new review for a listing

/reviews/view - name of location (key) as input and give user reviews of specified location

/search/ - address as an input and give user data of that location

https://amherst-reviews.herokuapp.com/Ryan/home.html

![HTML](pictures/Create-Pre.JPG)
![HTML](pictures/Create-Post.JPG)
For creation we allow users to create account with the API endpoint /user/register

Division of Labor:
Jason:
Everything in the Jason directory
Auto deployment on heroku
Some of the server.js file

Nadia:
Everything in the Nadia directory
CRUD development
Some of the server.js file

Ryan:
Everything in the Ryan directory
CRUD development
Some of the server.js file
