import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import NotePreview from "./components/NotePreview.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notesView" element={<NotePreview />} />
      </Routes>
    </Router>
  );
};

export default App;
