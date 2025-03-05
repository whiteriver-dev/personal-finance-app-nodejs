Work progress:

Setup:

BACKEND:
- Created db.js where we connected SQlite database
- In server.js we created tables in SQLite using db.serialize and db.run. The tables included 'users, transactions, budgets, pots, recurring_bills'. 
- We then created endpoints including /register (includes hashing password), /login (includes issuing JWT token), /users (to list all users), /dashboard (to check for JWT token before proceeding).
- Created authMiddleware to handle authenticating token when directing to dashboard
- Tested all the endpoints using Postman - everything works well. Users are able to register, login, authenticate JSON token

FRONTEND
- 


TODO:

- Double check why you are able to send empty form to database
- Delete duplicate accounts
- Ensure capitalization of name
- See why its not displaying name and email in dashboard

