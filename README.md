## 🗒️ Notes App (MERN Stack)

A full-stack **Notes App** built with the **MERN stack** (MongoDB, Express, React, Node.js). It allows users to create, update, delete, and manage notes — all stored securely in the cloud using **MongoDB Atlas**.

---

### 🔗 Live Demo

* [Notes App](https://notes-frontend-q9i9.onrender.com/)

---

### ✨ Features

* 📝 Add, edit, and delete notes
* 🔍 Search notes in real-time
* ☁️ Cloud database using MongoDB Atlas
* 🧠 Persistent data (no localStorage)
* 💻 REST API built with Express.js and Node.js
* ⚡ Responsive UI using Tailwind CSS

---

### 🛠️ Tech Stack

#### Frontend:

* ⚛️ React JS
* 🎨 Tailwind CSS

#### Backend:

* 🌐 Node.js + Express.js
* 🌍 MongoDB Atlas (cloud database)
* 🔐 Mongoose (ODM)

---

### 🧑‍💻 Installation

#### 1. Clone the Repo

```bash
git clone https://github.com/krish-maurya/Notes.git
cd Notes
```

#### 2. Install Client Dependencies

```bash
cd client
npm install
npm start
```

#### 3. Install Server Dependencies

```bash
cd ../server
npm install
npm run dev
```

> Make sure to add your **MongoDB URI** in a `.env` file inside the `server/` folder:

```
MONGO_URI=your_mongodb_atlas_uri
```

---

### 📁 Project Structure

```
Notes/
├── client/           # React frontend
│   ├── src/
│   └── public/
├── server/           # Express backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── config/
├── .env
├── package.json
└── README.md
```

---

### 🚀 Deployment Info

* 🌍 Backend: Hosted on MongoDB Atlas (cloud)
* 📦 Easily deployable to **Render**

---

### 🙌 Author

Built with by [Krish Maurya](https://github.com/krish-maurya)

---

### 📄 License

This project is licensed under the [MIT License](LICENSE)
