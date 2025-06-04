require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const authenticateToken = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['https://project1.whiteriver-dev.com',
    'personal-finance-app-nodejs-e1geysihk-whiteriver-devs-projects.vercel.app',
    'http://localhost:5173'],
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

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---- USER REGISTRATION ----
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // --- Validation ---
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password must be provided.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password should be at least 6 characters long.' });
  }
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Name must only contain letters and spaces.' });
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email is invalid' });
  }

  const capitalizedName = capitalizeWords(name.trim());

  try {
    // Check if the email already exists
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const userInsert = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [capitalizedName, email, hashedPassword]
    );
    const userId = userInsert.rows[0].id;

    // --- Default Budgets ---
    const budgets = [
      { name: 'Entertainment', amount: 50, color_id: 1 },
      { name: 'Bills', amount: 750, color_id: 3 },
      { name: 'Dining Out', amount: 75, color_id: 2 },
      { name: 'Personal Care', amount: 100, color_id: 4 }
    ];
    for (const b of budgets) {
      await pool.query(
        'INSERT INTO budgets (name, amount, user_id, color_id) VALUES ($1, $2, $3, $4)',
        [b.name, b.amount, userId, b.color_id]
      );
    }

    // --- Default Pots ---
    const pots = [
      { name: 'Savings', saved: 0, target: 5000, color: '#277C78' },
      { name: 'Concert Ticket', saved: 0, target: 300, color: '#626070' },
      { name: 'Gift', saved: 0, target: 150, color: '#82C9D7' },
      { name: 'New Laptop', saved: 0, target: 2500, color: '#F2CDAC' },
      { name: 'Holiday', saved: 0, target: 3000, color: '#826CB0' }
    ];
    for (const p of pots) {
      await pool.query(
        'INSERT INTO pots (name, saved, target, user_id, color) VALUES ($1, $2, $3, $4, $5)',
        [p.name, p.saved, p.target, userId, p.color]
      );
    }

    res.status(201).json({ message: 'User created successfully', userId });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---- LOGIN ----
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'Invalid username or password.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ 
        message: 'Login successful', 
        token,
        userId: user.id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (err) {
    res.status(500).send('Error retrieving user');
  }
});

// ---- USERS ----
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error retrieving users');
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name FROM users WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user' });
  }
});

app.get('/dashboard', authenticateToken, (req, res) => {
  res.send({ message: `Welcome ${req.user.email}, to your dashboard!` });
});

// ---- BUDGETS CRUD ----

// Budgets with spent
app.get('/budgets-with-spent/:userId', async (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT 
      b.id, 
      b.name, 
      b.amount, 
      b.color_id,          
      c.hex AS color,     
      COALESCE(SUM(t.amount), 0) as spent
    FROM budgets b
    LEFT JOIN transactions t 
      ON t.category = b.name AND t.user_id = $1
    LEFT JOIN colors c 
      ON b.color_id = c.id
    WHERE b.user_id = $1
    GROUP BY b.id, c.hex
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Database error');
  }
});

// Budgets GET
app.get('/budgets/:userId', async (req, res) => {
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
    WHERE b.user_id = $1;
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budgets' });
  }
});

// Budgets POST
app.post('/budgets', async (req, res) => {
  const { name, amount, user_id, color_id } = req.body;
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }
  if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
    return res.status(400).json({ message: 'Amount must have at most 2 decimal places.' });
  }
  const formattedName = capitalizeWords(name);
  if (formattedName.length > 30) {
    return res.status(400).json({ message: 'Budget name must be 30 characters or fewer.' });
  }
  const query = `INSERT INTO budgets (name, amount, user_id, color_id) VALUES ($1, $2, $3, $4) RETURNING id`;
  try {
    const { rows } = await pool.query(query, [formattedName, parsedAmount, user_id, color_id]);
    res.status(201).json({ id: rows[0].id, name, amount, user_id });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Budgets PUT
app.put('/budgets/:id', async (req, res) => {
  const { id } = req.params;
  const { name, amount, color_id } = req.body;
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }
  if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
    return res.status(400).json({ message: 'Amount must have at most 2 decimal places.' });
  }
  const formattedName = capitalizeWords(name);
  if (formattedName.length > 30) {
    return res.status(400).json({ message: 'Budget name must be 30 characters or fewer.' });
  }
  const query = `UPDATE budgets SET name = $1, amount = $2, color_id = $3 WHERE id = $4`;
  try {
    await pool.query(query, [formattedName, amount, color_id, id]);
    res.json({ message: 'Budget updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update budget' });
  }
});

// Budgets DELETE
app.delete('/budgets/:id', async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM budgets WHERE id = $1`;
  try {
    await pool.query(query, [id]);
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete budget' });
  }
});

// ---- COLORS ----
app.get('/colors', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM colors');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching colors' });
  }
});

// ---- TRANSACTIONS ----
// GET (paginated)
app.get('/transactions', async (req, res) => {
  const userId = req.query.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  const sort = req.query.sort || 'latest';
  const category = req.query.category || '';

  let orderBy;
  switch (sort) {
    case 'latest': orderBy = 'ORDER BY date DESC'; break;
    case 'oldest': orderBy = 'ORDER BY date ASC'; break;
    case 'a-z': orderBy = 'ORDER BY description ASC'; break;
    case 'z-a': orderBy = 'ORDER BY description DESC'; break;
    case 'highest': orderBy = 'ORDER BY amount DESC'; break;
    case 'lowest': orderBy = 'ORDER BY amount ASC'; break;
    default: orderBy = 'ORDER BY date DESC';
  }

  let baseQuery = `
    SELECT id, amount, description, category, date
    FROM transactions
    WHERE user_id = $1
      AND description ILIKE $2
  `;
  const params = [userId, `%${search}%`];

  if (category) {
    baseQuery += ` AND category = $3`;
    params.push(category);
  }
  baseQuery += ` ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  try {
    const { rows } = await pool.query(baseQuery, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Transaction count
app.get('/transactions/count', async (req, res) => {
  const userId = req.query.userId;
  const search = req.query.search || '';
  const category = req.query.category || '';
  let query = `
    SELECT COUNT(*) as total
    FROM transactions
    WHERE user_id = $1
      AND description ILIKE $2
  `;
  const params = [userId, `%${search}%`];
  if (category && category !== 'All Transactions') {
    query += ` AND category = $3`;
    params.push(category);
  }
  try {
    const { rows } = await pool.query(query, params);
    res.json({ total: rows[0].total });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Recent transactions
app.get('/transactions/recent/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const { rows } = await pool.query(
      `SELECT id, amount, description, category, date
      FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT 100`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST transaction
app.post('/transactions', async (req, res) => {
  const { amount, description, category, date, user_id } = req.body;
  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ message: 'Amount must be a valid number.' });
  }
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ message: 'Description is required.' });
  }
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'Date must be valid.' });
  }
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }
  const formattedDescription = capitalizeFirstLetter(description.trim());
  try {
    const result = await pool.query(
      `INSERT INTO transactions (amount, description, category, date, user_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [amount, formattedDescription, category || null, date, user_id]
    );
    res.status(201).json({
      id: result.rows[0].id,
      amount,
      description: formattedDescription,
      category: category || null,
      date,
      user_id
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE transaction
app.delete('/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM transactions WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

// ---- POTS ----
app.get('/pots/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const { rows } = await pool.query(
      `SELECT id, name, saved, target, color
       FROM pots
       WHERE user_id = $1
       ORDER BY id ASC`,
      [userId]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/pots', async (req, res) => {
  const { name, saved, target, user_id, color } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Name is required and must be a string.' });
  }
  if (!target || typeof target !== 'number' || isNaN(target)) {
    return res.status(400).json({ message: 'Target amount must be a valid number.' });
  }
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }
  if (!color) {
    return res.status(400).json({ message: 'Color is required.' });
  }
  const formattedName = capitalizeWords(name.trim());
  try {
    const result = await pool.query(
      `INSERT INTO pots (name, saved, target, user_id, color)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [formattedName, saved ?? 0, target, user_id, color]
    );
    res.status(201).json({
      id: result.rows[0].id,
      name: formattedName,
      saved: saved ?? 0,
      target,
      user_id,
      color,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/pots/:id', async (req, res) => {
  const { id } = req.params;
  const { name, target, color, saved } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Name is required and must be a string.' });
  }
  if (!target || typeof target !== 'number' || isNaN(target)) {
    return res.status(400).json({ message: 'Target amount must be a valid number.' });
  }
  if (!color || typeof color !== 'string') {
    return res.status(400).json({ message: 'Color must be a valid hex string.' });
  }
  if (typeof saved !== 'number' || isNaN(saved)) {
    return res.status(400).json({ message: 'Saved amount must be a valid number.' });
  }
  const formattedName = name.trim();
  try {
    await pool.query(
      `UPDATE pots SET name = $1, target = $2, color = $3, saved = $4 WHERE id = $5`,
      [formattedName, target, color, saved, id]
    );
    res.status(200).json({
      id,
      name: formattedName,
      target,
      color,
      saved
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/pots/withdraw/:id', async (req, res) => {
  const { id } = req.params;
  const { saved } = req.body;
  if (typeof saved !== 'number' || isNaN(saved) || saved < 0) {
    return res.status(400).json({ message: 'Invalid saved amount.' });
  }
  try {
    const result = await pool.query(
      `UPDATE pots SET saved = $1 WHERE id = $2`,
      [saved, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pot not found.' });
    }
    res.status(200).json({ id, saved });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/pots/:id', async (req, res) => {
  const potId = req.params.id;
  if (!potId) {
    return res.status(400).json({ message: 'Pot ID is required.' });
  }
  try {
    const result = await pool.query(`DELETE FROM pots WHERE id = $1`, [potId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pot not found.' });
    }
    res.status(200).json({ message: 'Pot deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

// ---- SERVER LISTEN ----
const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
