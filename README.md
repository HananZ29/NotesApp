# Note Taking App

A simple and efficient **Note Taking Application** designed to create, edit, delete, and summarize notes. It uses **Node.js** and **MySQL** for the backend and integrates **Together.AI** for AI-powered note summarization.

---

## Features

- Create, edit, and delete notes.
- AI-powered summarization of note content.
- MySQL for local storage persistence.
- Clean and modular backend design.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HZ29/NotesApp.git
cd note-taking-app/server
```
2. Set Up environment variables
```bash
echo. > .env
```
###Add the following to your .env file 
```env
TOGETHER_API_KEY=your_together_ai_api_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=notes_app
PORT=5000

##Replace your_together_ai_api_key and your_mysql_password with your actual Together.AI API key and MySQL password.
```
3. Set Up MySQL Database
Log into MySQL:
```bash
mysql -u root -p
##Run the following SQL commands to create and configure the database:
```sql
CREATE DATABASE notes_app;
USE notes_app;

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL
);
```bash
##4. Install Dependencies
npm install
```bash
##Start the server 
npm start 
```bash
##Run frontend
cd client
npm start
-------
```
Technologies Used

-Node.js
-Express.js
-MySQL
-Together.AI for AI integration
-dotenv for environment variable management