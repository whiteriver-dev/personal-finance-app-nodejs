const express = require('express');
const cors = require('cors');
const db = require('./db');  // Import the db connection
const app = express();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const SECRET_KEY = "fryingpan69";
const authenticateToken = require('./middleware/authMiddleware');
app.use(express.json());  // Middleware to parse JSON requests
app.use(cors({
  origin: 'http://localhost:5173', // allow Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// UTILITY FUNCTIONS

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Create the tables if they don't already exist
db.serialize(() => {
  // Users table (for authentication)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL
  )`);

  // Transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    description TEXT,
    category TEXT,
    date TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Budgets table
  db.run(`CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount REAL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Pots (savings) table
  db.run(`CREATE TABLE IF NOT EXISTS pots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount REAL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Recurring bills table
  db.run(`CREATE TABLE IF NOT EXISTS recurring_bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount REAL,
    due_date TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

const PORT = 5050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Backend validation - ensures that the name, email, and password are provided
  if (!email || !password || !name || password.length < 0) {
    return res.status(400).json({ message: 'Name, email, and password must be provided. Password should be at least 6 characters long.' });
  }

  // Name validation: check for valid name (letters and spaces only)
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Name must only contain letters and spaces.' });
  }

  // Validation for password length
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Password should be at least 6 characters long' });
  }

  // Check if the email format is valid
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email is invalid' });
  }

  // Capitalize name before storing it
  const capitalizedName = name
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ');

  try {
      // Check if the email already exists in the database
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
          if (err) {
              return res.status(500).json({ message: 'Error checking for existing user' });
          }
          if (existingUser) {
              return res.status(400).json({ message: 'Email already registered' }); // Return message as JSON
          }

          // If email does not exist, continue with registration
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Insert the user into the database
          const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
          stmt.run(capitalizedName, email, hashedPassword, function (err) {
              if (err) {
                  return res.status(500).json({ message: 'Error registering user' }); // Return message as JSON
              }
              res.status(201).json({ message: 'User created', userId: this.lastID }); // Return success as JSON
          });
          stmt.finalize();
      });
  } catch (err) {
      console.message(err);
      res.status(500).json({ message: 'Error hashing password' }); // Return message as JSON
  }
});



  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Retrieve the user from the database
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).send('Error retrieving user');
      }
      if (!user) {
        return res.status(404).send('Invalid username or password.');
      }
  
      // Compare the entered password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
          expiresIn: '1h', // Token validity (1 hour)
        });
  
        res.send({ 
          message: 'Login successful', 
          token, 
          name: user.name, 
          email: user.email,
        }); // Send the token to the client
      } else {
        res.status(401).send('Invalid username or password.');
      }
    });
  });

  // USERS
  // User GETs (fetch all users)

  app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error retrieving users');
      }
      res.json(rows);
    });
  });

  app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT name FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) return res.status(500).json({ message: 'Error retrieving user' });
      if (!row) return res.status(404).json({ message: 'User not found' });
      res.json(row); // returns { name: 'User Name' }
    });
  });
  
  app.get('/dashboard', authenticateToken, (req, res) => {
    res.send({ message: `Welcome ${req.user.email}, to your dashboard!` });
  });

  // BUDGETS CRUD OPERATIONS

  // Budget GETs (fetch all budgets for a user)

  app.get('/budgets-with-spent/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    const query = `
    SELECT 
        b.id, 
        b.name, 
        b.amount, 
        b.color_id,          
        c.hex AS color,     
        IFNULL(SUM(t.amount), 0) as spent
      FROM budgets b
      LEFT JOIN transactions t 
        ON t.category = b.name AND t.user_id = ?
      LEFT JOIN colors c 
        ON b.color_id = c.id
      WHERE b.user_id = ?
      GROUP BY b.id

    `;
  
    db.all(query, [userId, userId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.json(rows);
    });
  });
  
  app.get('/budgets/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const query = `
      SELECT 
        b.id, 
        b.name, 
        b.amount, 
        b.color_id, 
        c.name AS color_name, 
        c.hex AS color
      FROM budgets b
      LEFT JOIN colors c ON b.color_id = c.id
      WHERE b.user_id = ?;
    `;
  
    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching budgets' });
      }
      res.json(rows);
    });
  });

  
  //Budget POSTs (add new budgets)

  app.post('/budgets', (req, res) => {
    const { name, amount, user_id, color_id } = req.body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    const formattedName = capitalizeWords(name);
    if (formattedName.length > 30) {
      return res.status(400).json({ message: 'Budget name must be 30 characters or fewer.' });
    }

    const query = `INSERT INTO budgets (name, amount, user_id, color_id) VALUES (?, ?, ?, ?)`;
  
    db.run(query, [formattedName, parsedAmount, user_id, color_id], function (err) {
      if (err) {
        console.error('Error adding budget:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      res.status(201).json({ id: this.lastID, name, amount, user_id });
    });
  });

  
  //Budget PUTs (update budgets)

  app.put('/budgets/:id', (req, res) => {
    const { id } = req.params;
    const { name, amount, color_id } = req.body;
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    const formattedName = capitalizeWords(name);
    if (formattedName.length > 30) {
      return res.status(400).json({ message: 'Budget name must be 30 characters or fewer.' });
    }
  
    const query = `
      UPDATE budgets
      SET name = ?, amount = ?, color_id = ?
      WHERE id = ?
    `;
  
    db.run(query, [formattedName, amount, color_id, id], function (err) {
      if (err) {
        console.error('Error updating budget:', err);
        return res.status(500).json({ message: 'Failed to update budget' });
      }
  
      res.json({ message: 'Budget updated successfully' });
    });
  });
  
  //Budget DELETEs (delete budgets)  
  app.delete('/budgets/:id', (req, res) => {
    const { id } = req.params;
  
    const query = `DELETE FROM budgets WHERE id = ?`;
  
    db.run(query, [id], function (err) {
      if (err) {
        console.error('Error deleting budget:', err);
        return res.status(500).json({ message: 'Failed to delete budget' });
      }
  
      res.json({ message: 'Budget deleted successfully' });
    });
  });
  
  
  
  // Color GETs (fetch all colors for budgets)
  app.get('/colors', (req, res) => {
    db.all('SELECT * FROM colors', [], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching colors' });
      }
      res.json(rows);
    });
  });

// TRANSACTIONS
// Transaction GETs (fetch all transactions for a user)

  app.get('/transactions/:userId', (req, res) => {
    const userId = req.params.userId;
  
     db.all(`
      SELECT id, amount, description, category, date, user_id 
      FROM transactions 
      WHERE user_id = ? 
      ORDER BY date DESC

    `, [userId], (err, rows) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(rows);
    });
  });

  
