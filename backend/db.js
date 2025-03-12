const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database (creates a new one if it doesn't exist)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Export the db object so we can use it in other files
module.exports = db;