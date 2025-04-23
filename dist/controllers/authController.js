"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getCurrentUser = exports.googleSignIn = exports.login = exports.signup = void 0;
const supaBaseClient_1 = require("../utils/supaBaseClient");
// User signup -> api for user signup
const signup = async (req, res) => {
    try {
        const { email, password, name, phoneNumber } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        // Create user with Supabase Auth
        const { data, error } = await supaBaseClient_1.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phoneNumber
                }
            }
        });
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(201).json({
            message: 'User created successfully',
            user: data.user
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.signup = signup;
// API To Login an user
// api which would be used for login of an User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const { data, error } = await supaBaseClient_1.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            if (error.message.includes('Email not confirmed')) {
                res.status(401).json({
                    error: 'Please confirm your email before logging in',
                    needsEmailConfirmation: true
                });
                return;
            }
            res.status(401).json({ error: error.message });
            return;
        }
        // Extract token from session
        const token = data.session?.access_token;
        const refreshToken = data.session?.refresh_token;
        res.status(200).json({
            message: 'Login successful',
            user: data.user,
            token,
            refreshToken
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.login = login;
// Google OAuth sign in
const googleSignIn = async (req, res) => {
    try {
        // This route should be used to get the Google OAuth URL
        const { data, error } = await supaBaseClient_1.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.FRONTEND_URL}/auth/callback`
            }
        });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json({ url: data.url });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.googleSignIn = googleSignIn;
// Get current user
//api to fetch the current Details of the user
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCurrentUser = getCurrentUser;
// Logout
const logout = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
        }
        const { error } = await supaBaseClient_1.supabase.auth.signOut();
        if (error) {
            res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.logout = logout;
