import React from "react";
import { ArrowLeft, Edit, Trash2, Heart, Tag } from "lucide-react";

export default function NotePreview({ note, onClose, onEdit, onDelete, onToggleFavorite }) {
  if (!note) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-5">
      <div className="w-full max-w-4xl h-full max-h-[90vh] overflow-hidden">
        <div className={`rounded-2xl shadow-2xl p-8 space-y-6 h-full overflow-y-auto ${note.color}`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 flex items-center transition-colors bg-white bg-opacity-50 hover:bg-opacity-70 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="ml-2 font-medium">Back</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleFavorite(note._id)}
                className={`p-2 rounded-full transition-colors bg-white bg-opacity-50 hover:bg-opacity-70 ${
                  note.isFavorite 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${note.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => onEdit(note)}
                className="p-2 text-gray-600 hover:text-blue-600 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(note._id)}
                className="p-2 text-gray-600 hover:text-red-600 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {note.title}
              </h1>
              <p className="text-gray-600 text-sm">
                Created on {note.date}
              </p>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-2 bg-white bg-opacity-60 text-gray-700 rounded-full text-sm font-medium shadow-sm"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="bg-white bg-opacity-30 rounded-xl p-6 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                  {note.description}
                </p>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-30">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Word count:</span> {note?.description ? note.description.trim().split(/\s+/).length : 0} words
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Character count:</span> {note?.description ? note.description.length : 0} characters
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}