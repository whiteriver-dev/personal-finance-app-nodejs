Work progress:

Setup:

BACKEND:
- Created db.js where we connected SQlite database
- In server.js we created tables in SQLite using db.serialize and db.run. The tables included 'users, transactions, budgets, pots, recurring_bills'. 
- We then created endpoints including /register (includes hashing password), /login (includes issuing JWT token), /users (to list all users), /dashboard (to check for JWT token before proceeding).
- Created authMiddleware to handle authenticating token when directing to dashboard
- Tested all the endpoints using Postman - everything works well. Users are able to register, login, authenticate JSON token

FRONTEND
- Created basic buttons
- Created Login and Register components
- Created frontend form validation with user feedback when incorrect
- Frontend successfuly sends API requests to backend and receives responses
- Login form saves backend response into localStorage - saving the name, email, and JWT token
- Created AuthTemplate and placed Register and Login components into it. Login/Register shows depending on the route (website.com/login or website.com/register). 
- Polished up some bugs such as being able to register empty fields, and ensuring localStorage works correctly



