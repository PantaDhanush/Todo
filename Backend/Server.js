const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// 🗄️ Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dhanush@05',
  database: 'todo'
});

db.connect(err => {
  if (err) {
    console.log("❌ Error connecting to DB:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

app.use(cors());
app.use(express.json());

// 📥 Get all todo items
app.get('/', (req, res) => {
  db.query('SELECT * FROM todoItems', (err, result) => {
    if (err) {
      console.log("Database Error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(result);
  });
});

// ➕ Add a new todo
app.post('/additem', (req, res) => {
  const text = req.body.text;
  db.query('INSERT INTO todoItems (itemDescription) VALUES (?)', [text], (err, result) => {
    if (err) {
      console.log("Insert Error:", err);
      return res.status(500).json({ error: "Insert failed" });
    }
    console.log("✅ Item added");
    res.json({ message: "Item added successfully" });
  });
});

// ✏️ Edit an existing todo
app.put('/edit-item', (req, res) => {
  const { ID, itemDescription } = req.body;
  db.query(
    'UPDATE todoItems SET itemDescription = ? WHERE ID = ?',
    [itemDescription, ID],
    (err, result) => {
      if (err) {
        console.log("Update Error:", err);
        return res.status(500).json({ error: "Update failed" });
      }
      console.log("✅ Item updated");
      res.json({ message: "Item updated successfully" });
    }
  );
});

// ❌ Delete a todo
app.delete('/delete-item', (req, res) => {
  const { ID } = req.body;
  db.query('DELETE FROM todoItems WHERE ID = ?', [ID], (err, result) => {
    if (err) {
      console.log("Delete Error:", err);
      return res.status(500).json({ error: "Delete failed" });
    }
    console.log("✅ Item deleted");
    res.json({ message: "Item deleted successfully" });
  });
});

// 🚀 Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
