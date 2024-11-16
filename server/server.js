import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import Together from 'together-ai';
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());
console.log(process.env)
console.log(process.env.TOGETHER_API_KEY)

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});


const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});


app.get('/api/notes', (req, res) => {
  const query = 'SELECT * FROM notes';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching notes', error: err });
    }
    res.json(results);
  });
});


app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const query = 'INSERT INTO notes (title, content) VALUES (?, ?)';
  db.query(query, [title, content], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding note', error: err });
    }
    res.status(201).json({ message: 'Note added successfully', noteId: result.insertId });
  });
});


app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
  db.query(query, [title, content, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating note', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note updated successfully' });
  });
});


app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM notes WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting note', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  });
});


app.post('/api/notes/summary', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required for summarization' });
  }

  try {
    const stream = await together.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      messages: [{ role: 'user', content: `Summarize the following content: ${content}` }],
      stream: false,
    });

    const summary = stream.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing content:', error);
    res.status(500).json({ message: 'Error summarizing content', error });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
