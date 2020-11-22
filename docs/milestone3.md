User table
| Column       | Data Type | Description               |
|--------------|-----------|---------------------------|
| Username     | String    | The username of a user    |
| Hash         | String    | The encrypted password    |
| Salt         | String    | The salt of a user        |

Reviews table
| Column       | Data Type | Description                                    |
|--------------|-----------|------------------------------------------------|
| Category     | String    | The type of service                            |
| Id           | String    | The id of the listing                          |
| Description  | String    | The review left by user                        |
| Price        | int       | The cost/relative expense                      |
| Username     | String    | The username of the person who wrote the review|

Grocery Listings table
| Column       | Data Type | Description                        |
|--------------|-----------|------------------------------------|
| Name         | String    | The name of the listing            |
| Address      | String    | The address of the listing         |
| Likes        | int       | The amount of likes for the listing|

Gym Listings table
| Column       | Data Type | Description                        |
|--------------|-----------|------------------------------------|
| Name         | String    | The name of the listing            |
| Address      | String    | The address of the listing         |
| Likes        | int       | The amount of likes for the listing|

Housing Listings table
| Column       | Data Type | Description                        |
|--------------|-----------|------------------------------------|
| Address      | String    | The address of the listing         |
| Landlord     | String    | The landlord who owns the listing  |
| Likes        | int       | The amount of likes for the listing|

Laundromat Listings table
| Column       | Data Type | Description                        |
|--------------|-----------|------------------------------------|
| Name         | String    | The name of the listing            |
| Address      | String    | The address of the listing         |
| Likes        | int       | The amount of likes for the listing|

Laundromat Listings table
| Column       | Data Type | Description                                |
|--------------|-----------|--------------------------------------------|
| Username     | String    | The usernames of all the users             |
| All Listings | String    | Columns of all the listings where a boolean|
                             determines if a user liked a listing       |


Breakdown of labor:

Ryan:
Server login verification - a user cannot access the website until they create an account and login (or just login if they have an account)

Signout endpoint

Password encryption/hashing and salt creation for each user
Updating of navbar to api endpoints

Re-organization of files to have express statically serve the client

User login and register endpoints that link up to users database

Nadia:
Wrote post statements for the write-review pages for laundromats, housing, gyms and grocery stores in the server

Updated fetch statements from each write-review javascript file

Updated url of each write-review html page to API endpoint

Jason:
Wrote both get and post endpoints

Pages including grocery listings, grocery new listing, grocery read reviews, gym listings, gym new listing, gym read reviews, housing listings, housing new listing, housing read reviews, laundromat listings, laundromat new listing, laundromat read reviews, delete account

Grocery Listings, Gym Listings, Laundromat Listings, Housing Listings, and Likes databases
