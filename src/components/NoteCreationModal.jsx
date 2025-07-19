import React, { useState, useEffect } from "react";
import { X, Save, Tag, Plus, Trash2, Palette } from "lucide-react";

const NoteCreationModal = ({ isOpen, onClose, onSave, editingNote }) => {
  const colors = [
    { name: "Yellow", class: "bg-yellow-200", border: "border-yellow-300" },
    { name: "Orange", class: "bg-orange-300", border: "border-orange-400" },
    { name: "Red", class: "bg-red-300", border: "border-red-400" },
    { name: "Pink", class: "bg-pink-300", border: "border-pink-400" },
    { name: "Purple", class: "bg-purple-300", border: "border-purple-400" },
    { name: "Blue", class: "bg-blue-300", border: "border-blue-400" },
    { name: "Green", class: "bg-green-300", border: "border-green-400" },
    { name: "Teal", class: "bg-teal-300", border: "border-teal-400" },
  ];
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    tags: [],
    color: colors[Math.floor(Math.random() * colors.length)].class,
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (editingNote) {
      setNoteData({
        title: editingNote.title,
        description: editingNote.description,
        tags: editingNote.tags || [],
        color: editingNote.color,
      });
    } else {
      setNoteData({
        title: "",
        description: "",
        tags: [],
        color: colors[Math.floor(Math.random() * colors.length)].class,
      });
    }
  }, [editingNote, isOpen]);

  const addTag = () => {
    if (newTag.trim() && !noteData.tags.includes(newTag.trim())) {
      setNoteData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setNoteData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = () => {
    if (!noteData.title.trim() || !noteData.description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    const noteToSave = {
      ...noteData,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isFavorite: editingNote?.isFavorite || false,
    };

    onSave(noteToSave);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingNote ? "Edit Note" : "Create New Note"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Title
              </label>
              <input
                type="text"
                value={noteData.title}
                onChange={(e) =>
                  setNoteData((prev) => ({ ...prev, title: e.target.value }))
                }
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Enter note title..."
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Note Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.class}
                    onClick={() =>
                      setNoteData((prev) => ({ ...prev, color: color.class }))
                    }
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                      color.class
                    } ${
                      noteData.color === color.class
                        ? color.border + " ring-2 ring-blue-500 ring-offset-2"
                        : "border-gray-300"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {noteData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag..."
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note description
              </label>
              <textarea
                value={noteData.description}
                onChange={(e) =>
                  setNoteData((prev) => ({ ...prev, description: e.target.value }))
                }
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="12"
                placeholder="Start writing your note..."
              />
            </div>

            {/* Preview */}
            <div
              className={`p-4 rounded-lg ${noteData.color} border-2 border-dashed border-gray-300`}
            >
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Preview
              </h4>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  {noteData.title || "Note Title"}
                </h3>
                <p className="text-gray-700 text-sm">
                  {noteData.description || "Note description will appear here..."}
                </p>
                {noteData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {noteData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-white bg-opacity-60 text-gray-700 rounded-full text-xs"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {editingNote ? "Last modified: " + editingNote.date : "New note"}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingNote ? "Update Note" : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCreationModal;
