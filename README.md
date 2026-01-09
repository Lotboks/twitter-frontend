

- Create folder twitter-clone
- Clone both repos in folder (twitter-frontend, twitter-backend)
- Open both repos and npm install both to download all dependencies
- On Frontend thats it now on backend
- After npm install, open psql in cli, see which command is for your operating system
- run <CREATE DATABASE twitter_clone;>
- for simplicity <CREATE USER admin WITH PASSWORD 'test123';>
- <GRANT ALL PRIVILEGES ON DATABASE twitter_clone TO admin;>
- <ALTER DATABASE twitter_clone OWNER TO admin;>
- go to repo create .env file and inside copy the variable from env.example into .env and add the db owner name, password and db name.
- "postgresql://admin_name:admin_password@localhost:5432/twitter_clone"
- run "psql postgresql://admin_name:admin_password@localhost:5432/twitter_clone" to check if it opens the db.
- next exit psql and run "npx prisma db push" to create the schema for the db with prisma

- now everything should work and you can start the BE server first "npm run start:dev" localhost:3000
- then the FE server "npm run dev" localhost:3001, localhost:3001/register, localhost:3001/login, localhost:3001/feed, localhost:3001/profile...

  

once you do that go to localhost:3001/register and create an account, the account has a jwt security check,
when you create the account you will be redirected to a login page, enter your user and password and you are now on twatter.
Its a simple clone nothing majestic you can create a post, once created you can comment like and open the profile of the user,
you can also register another user to comment on each others posts. that is pretty much it. 😅

I started the project on the 2nd of january so i didnt use the full 3 weeks given as it kind of caught me at a bad time since i had planned a trip for christmas before hand for a vacation,
so when i read it i didnt have my laptop with me and with the vacation and holidays i did this in about a week.
Its not perfect in any shape or form, and deffinetly not something im most proud of,
but i tried my best to create something with nestJS and nextJS both of which i havent used till the start of this project,
i couldev created this app with python since thats what im comfortable with but i saw no point in that since the interest is in next and nest.
Since i started the project i developed it with the documentation, my past experience with other languages architecture, windsurf and chatGPT,
its deffinetly not the most beautifull code i presume, but it was what i could come up with in that short period of time.

Best Regards
Aleksandar.


