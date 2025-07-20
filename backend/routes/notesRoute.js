const express = require("express");
const router = express.Router();
const Notes = require("../module/Notes");
const { generateToken, jwtAuthMiddlware } = require("../jwt");
const { findById } = require("../module/User");
const success = false;

router.get("/", jwtAuthMiddlware, async (req, res) => {
    try {
        const notes = await Notes.find({ userId: req.user.id });
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});

router.post("/addnotes", jwtAuthMiddlware, async (req, res) => {
    try {
        const { title, description, tags , color} = req.body;
        const newNote = new Notes({
            userId: req.user.id,
            title,
            description,
            tags,
            color,
        });
        const savedNote = await newNote.save();
        res.status(201).json({savedNote: savedNote, success: true, message: "Note added successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});

router.put("/updatenotes/:id", jwtAuthMiddlware, async (req, res) => {
    try {
       const noteData = req.body;
       const noteId = req.params.id;
       const updatenotes=await Notes.findByIdAndUpdate(noteId,noteData,{
                new: true,
                runValidators: true
       });
         if (!updatenotes) {
              return res.status(404).json({ message: "Note not found" , success: false });
         }
         res.status(200).json({updatenotes, success: true, message: "Note updated successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});

router.delete("/deletenotes/:id", jwtAuthMiddlware, async (req, res) => {
    try {
        const noteId = req.params.id;
        const deletedNote = await Notes.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found", success: false });
        }
        res.status(200).json({ message: "Note deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});
module.exports = router;