"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const noteController_1 = require("../controllers/noteController");
const notesRouter = express_1.default.Router();
notesRouter.get('/get-all-notes', authMiddleware_1.authenticateUser, noteController_1.getNotes);
notesRouter.post('/create-note', authMiddleware_1.authenticateUser, noteController_1.createNote);
notesRouter.post('/update-note', authMiddleware_1.authenticateUser, noteController_1.updateNote);
notesRouter.delete('/delete-note', authMiddleware_1.authenticateUser, noteController_1.deleteNote);
exports.default = notesRouter;
