"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authController_1 = require("../controllers/authController");
const authRouter = express_1.default.Router();
// Public routes
authRouter.post('/signup', authController_1.signup);
authRouter.post('/login', authController_1.login);
authRouter.get('/get-current-user', authMiddleware_1.authenticateUser, authController_1.getCurrentUser);
authRouter.post('/logout', authMiddleware_1.authenticateUser, authController_1.logout);
exports.default = authRouter;
