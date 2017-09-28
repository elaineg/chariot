# tahdisto
### QTMA Product Team
Colson | Damon | Elaine | Michelle

---

Please see the [wiki](https://github.com/damonrichardson/tahdisto/wiki) for some tutorials/guidelines

---

Program is kind of messy right now but I will explain setup and installation below:

Tahdisto (main folder) contains the server which is used for the Database.
Chariot contains a create-react-app and all the stuff in which the user will be viewing.

1. First step is to download [mongoDB](https://docs.mongodb.com/master/tutorial/install-mongodb-on-os-x/?_ga=1.244629893.1444372754.1479134408)

to start mongoDB simply run 'mongod'.

2. If you haven't cloned the repo, clone it now
3. open terminal and cd into your-directory/../tahdisto and run 'npm install'
4. when (3) is done, cd into chariot and again run 'npm install'
5. Program is now installed. Open a terminal window and start mongoDB: 'mongod'
6. Open another terminal window and cd into your-directory/../tahdisto and run 'npm run dev' to run in dev mode
7. Program should be hosted at localhost:3000 (And should open automatically)
8. Database is running on localhost:3001 -> if you'd like to use postman or check http requests
9. Yes, program is create-react-app, and yes there is a lot of nonsense/bulk that can be scrapped, but we will do this later
10. Walk through the login process (see if you can successfully login through facebook) -> note the console logs
11. When you reach home, check within the mongoDB that your credentials have been saved: in any terminal window run 'mongo', then 'use chariot' (chariot is the name of our database), then 'db.users.find()' -> this will query the collection of users for everything, and should return back your credentials.
