"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const aiRouter = express_1.default.Router();
aiRouter.post('/create-summary', authMiddleware_1.authenticateUser, aiController_1.generateSummary);
aiRouter.post('/get-summary', authMiddleware_1.authenticateUser, aiController_1.getSummary);
exports.default = aiRouter;
