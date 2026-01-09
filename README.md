This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Create folder twitter-clone
Clone both repos in folder (twitter-frontend, twitter-backend)
Open both repos and npm install both to download all dependencies
On Frontend thats it now on backend
After npm install, open psql in cli, see which command is for your operating system
run "CREATE DATABASE twitter_clone;"
for simplicity <CREATE USER admin WITH PASSWORD 'test123';>
<GRANT ALL PRIVILEGES ON DATABASE twitter_clone TO admin;>
<ALTER DATABASE twitter_clone OWNER TO admin;>
go to repo create .env file and inside copy the variable from env.example into .env and add the db owner name, password and db name.
"postgresql://admin_name:admin_password@localhost:5432/twitter_clone"
run "psql postgresql://admin_name:admin_password@localhost:5432/twitter_clone" to check if it opens the db.
next exit psql and run "npx prisma db push" to create the schema for the db with prisma

now everything should work and you can start the BE server first "npm run start:dev" localhost:3000
then the FE server "npm run dev"

once you do that go to localhost:3000/register and create an account, the account has a jwt security check,
when you create the account you will be redirected to a login page, enter your user and password and you are now on twatter.
Its a simple clone nothing majestic you can create a post, once created you can comment like and open the profile of the user,
you can also register another user to comment on each others posts. that is pretty much it. 😅
