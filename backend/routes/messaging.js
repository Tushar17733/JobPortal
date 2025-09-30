import express from "express";
import { 
    checkEligibility, 
    getConversations, 
    startConversation, 
    getMessages, 
    sendMessage, 
    markAsRead 
} from "../controllers/messaging.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Check if user is eligible for messaging
router.get("/check-eligibility", isAuthenticated, checkEligibility);

// Get all conversations for a user
router.get("/conversations", isAuthenticated, getConversations);

// Start a new conversation (recruiter only)
router.post("/conversations/start", isAuthenticated, startConversation);

// Get messages for a conversation
router.get("/messages/:conversationId", isAuthenticated, getMessages);

// Send a message
router.post("/messages/send", isAuthenticated, sendMessage);

// Mark conversation as read
router.put("/messages/:conversationId/read", isAuthenticated, markAsRead);

export default router;
