import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/noteController";
const notesRouter = express.Router();


notesRouter.get('/get-all-notes',authenticateUser,getNotes);
notesRouter.post('/create-note',authenticateUser,createNote);
notesRouter.post('/update-note',authenticateUser,updateNote);
notesRouter.delete('/delete-note',authenticateUser,deleteNote);

export default notesRouter;


