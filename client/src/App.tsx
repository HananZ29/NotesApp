import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'

type Note = {
  id: number;
  title: string;
  content: string;
  summary?: string; 
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newNote = { title, content };
      await axios.post("http://localhost:5000/api/notes", newNote);
      fetchNotes();
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) return;

    try {
      const updatedNote = { ...selectedNote, title, content };
      await axios.put(`http://localhost:5000/api/notes/${selectedNote.id}`, updatedNote);
      fetchNotes();
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  
  const getSummary = async (noteId: number, content: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/notes/summary`, { content });
      const summary = response.data.summary;
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, summary } : note
        )
      );
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="appcontainer">
      <form className="note-form" onSubmit={(event) =>
        selectedNote ? handleUpdateNote(event) : handleAddNote(event)
      }>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="title"
          required
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="content"
          rows={10}
          required
        />
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>

      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button onClick={() => deleteNote(note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <button onClick={() => getSummary(note.id, note.content)}>
              View Summary
            </button>
            {note.summary && <p><strong>Summary:</strong> {note.summary}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
