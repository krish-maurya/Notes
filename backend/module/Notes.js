const mongoose = require("mongoose");
const USer = require("./User");
const NotesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
  color: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
});

const Notes = mongoose.model("Notes", NotesSchema);
module.exports = Notes;
