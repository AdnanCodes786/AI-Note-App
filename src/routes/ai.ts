import express from "express";
import { generateSummary, getSummary } from "../controllers/aiController";
import { authenticateUser } from "../middlewares/authMiddleware";
const aiRouter = express.Router();

aiRouter.post('/create-summary', authenticateUser,generateSummary)
aiRouter.post('/get-summary', authenticateUser,getSummary)


export default aiRouter;