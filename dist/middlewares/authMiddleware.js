"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const supaBaseClient_1 = require("../utils/supaBaseClient");
const authenticateUser = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify the token with Supabase
        const { data, error } = await supaBaseClient_1.supabase.auth.getUser(token);
        if (error || !data.user) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
        // Add the user to the request object
        req.user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication error' });
        return;
    }
};
exports.authenticateUser = authenticateUser;
