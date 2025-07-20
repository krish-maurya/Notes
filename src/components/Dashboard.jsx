import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Heart,
  Edit,
  Trash2,
  User,
  Tag,
  Filter,
  Grid,
  List,
  SortAsc,
} from "lucide-react";
import AuthForm from "./AuthForm";
import ProfilePage from "./ProfilePage";
import NoteCreationModal from "./NoteCreationModal";
import NotePreview from "./NotePreview";
import Toast from "./Toast";

export default function Dashboard() {
  const host = "http://localhost:3000/";
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [currentView, setCurrentView] = useState("notes"); // 'notes', 'profile'
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid', 'list'
  const [sortBy, setSortBy] = useState("date"); // 'date', 'title', 'favorites'
  const [filterTag, setFilterTag] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrentUser(null);
        return;
      }

      const response = await fetch(`${host}notes/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setNotes(json);
        showToast("Notes fetched successfully", "success");
      } else {
        console.error("Failed to fetch notes");
        showToast("Failed to fetch notes", "error");
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("currentUser");

    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      getNotes();
    } else {
      setCurrentUser(null);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView("notes");
    getNotes(); // Fetch notes after login
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setCurrentView("notes");
    setNotes([]);
  };

  const handleUpdateUser = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const handleSaveNote = async (noteData) => {
    const token = localStorage.getItem("token");
   
    if (!token) {
      console.error("No token found");
      return;
    }

    if (editingNote) {
      // Updating existing note
      try {
        const response = await fetch(`${host}notes/updatenotes/${editingNote._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(noteData),
        });

        if (response.ok) {
          const updatedNote = await response.json();
          const actualNote = updatedNote.updatenotes || updatedNote;
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note._id === editingNote._id ? actualNote : note
            )
            
          );
          showToast("Note updated successfully", "success");
        } else {
          console.error("Failed to update note");
          showToast("Failed to update note", "error");
        }
      } catch (err) {
        console.error("Failed to update note:", err);
      }
    } else {
      // Creating new note
      try {
        const response = await fetch(`${host}notes/addnotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(noteData),
        });

        if (response.ok) {
          const newNote = await response.json();
          const actualNote = newNote.savedNote || newNote;
          setNotes((prev) => [actualNote, ...prev]);
          showToast("Note created successfully", "success");
        } else {
          console.error("Failed to create note");
          showToast("Failed to create note", "error");
        }
      } catch (err) {
        console.error("Failed to create note:", err);
      }
    }

    setIsCreating(false);
    setEditingNote(null);
  };

  const handleEditNote = (note) => {
    setSelectedNote(null);
    setEditingNote(note);
    setIsCreating(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${host}notes/deletenotes/${noteId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setNotes((prev) => prev.filter((note) => note._id !== noteId));
          setSelectedNote(null);
          showToast("Note deleted successfully", "success");
        } else {
          console.error("Failed to delete note");
          showToast("Failed to delete note", "error");
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const toggleFavorite = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      const noteToUpdate = notes.find((note) => note._id === noteId);

      const response = await fetch(`${host}notes/updatenotes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...noteToUpdate,
          isFavorite: !noteToUpdate.isFavorite,
        }),
      });

      if (response.ok) {
        setNotes((prev) =>
          prev.map((note) =>
            note._id === noteId
              ? { ...note, isFavorite: !note.isFavorite }
              : note
          )
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap((note) => note.tags || []))];

  // Filter and sort notes
  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesTag = !filterTag || (note.tags || []).includes(filterTag);

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "favorites":
          return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        default:
          return (
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
          );
      }
    });

  const favoriteCount = notes.filter((note) => note.isFavorite).length;

  if (!currentUser) {
    return (
      <AuthForm
        isLogin={isLogin}
        onToggleMode={() => setIsLogin(!isLogin)}
        onLogin={handleLogin}
      />
    );
  }

  if (currentView === "profile") {
    return (
      <ProfilePage
        notes={notes}
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        onBack={() => setCurrentView("notes")}
      />
    );
  }

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleBack = () => {
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notes
                </h1>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("profile")}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{currentUser.username || currentUser.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <h2 className="text-3xl font-bold text-gray-900">Notes</h2>

            {/* Stats Cards */}
            <div className="flex space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-semibold text-blue-600">
                    {notes.length}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <Heart className="w-3 h-3 text-red-500 fill-current" />
                  <span className="text-sm text-gray-600">Favorites</span>
                  <span className="font-semibold text-red-600">
                    {favoriteCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter Controls */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Tags</option>
                {allTags.map((tag, index) => (
                  <option key={`${tag}-${index}`} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="favorites">Favorites</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Note Button */}
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Note
            </button>
          </div>
        </div>

        {/* Notes Grid/List */}
        {!selectedNote && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    className={`${
                      note.color || "bg-yellow-200"
                    } p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group relative transform hover:-translate-y-1`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                        {note.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(note._id);
                        }}
                        className={`ml-2 p-1 rounded-full transition-colors ${
                          note.isFavorite
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            note.isFavorite ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-4 mb-4">
                      {note.description}
                    </p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {note.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={`${note._id}-${tag}-${tagIndex}`}
                            className="inline-flex items-center px-2 py-1 bg-white bg-opacity-60 text-gray-700 rounded-full text-xs"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-white bg-opacity-60 text-gray-700 rounded-full text-xs">
                            +{note.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {new Date(
                          note.date || note.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>

                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNote(note);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note._id);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 cursor-pointer"
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              note.color || "bg-yellow-200"
                            }`}
                          ></div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {note.title}
                          </h3>
                          {note.isFavorite && (
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {note.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-500">
                            {new Date(
                              note.date || note.createdAt
                            ).toLocaleDateString()}
                          </span>
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {note.tags.map((tag, tagIndex) => (
                                <span
                                  key={`${note._id}-${tag}-${tagIndex}`}
                                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(note._id);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            note.isFavorite
                              ? "text-red-500 hover:text-red-600"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              note.isFavorite ? "fill-current" : ""
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNote(note);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-full transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note._id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm || filterTag ? "No notes found" : "No notes yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterTag
                    ? "Try adjusting your search terms or filters"
                    : "Create your first note to get started"}
                </p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center mx-auto shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Note
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Note Creation Modal */}
      <NoteCreationModal
        host={host}
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        editingNote={editingNote}
      />

      {/* Note Preview */}
      {selectedNote && (
        <NotePreview
          note={selectedNote}
          onClose={handleBack}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
