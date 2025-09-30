import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";
import { User } from "../models/userModel.js";

// Check if candidate is eligible for messaging (selected in any job)
export const checkEligibility = async (req, res) => {
    try {
        const userId = req.id;
        
        // Check if user has any accepted applications
        const acceptedApplications = await Application.find({
            applicant: userId,
            status: "accepted"
        }).populate('job');

        const eligible = acceptedApplications.length > 0;

        return res.status(200).json({
            success: true,
            eligible,
            acceptedJobs: acceptedApplications.map(app => ({
                jobId: app.job._id,
                jobTitle: app.job.title,
                company: app.job.company
            }))
        });
    } catch (error) {
        console.error("Error checking eligibility:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all conversations for a user
export const getConversations = async (req, res) => {
    try {
        const userId = req.id;
        
        const conversations = await Conversation.find({
            participants: userId,
            isActive: true
        })
        .populate('participants', 'fullName email')
        .populate('job', 'title company')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

        // Get unread counts for each conversation
        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conversation) => {
                const unreadCount = await Message.countDocuments({
                    conversation: conversation._id,
                    sender: { $ne: userId },
                    isRead: false
                });

                return {
                    ...conversation.toObject(),
                    unreadCount
                };
            })
        );

        return res.status(200).json({
            success: true,
            conversations: conversationsWithUnread
        });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Start a new conversation
export const startConversation = async (req, res) => {
    try {
        const { candidateId, jobId } = req.body;
        const recruiterId = req.id;

        // Verify the recruiter has access to this job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check if candidate is accepted for this job
        const application = await Application.findOne({
            job: jobId,
            applicant: candidateId,
            status: "accepted"
        });

        if (!application) {
            return res.status(400).json({
                success: false,
                message: "Candidate must be accepted for this job to start a conversation"
            });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [candidateId, recruiterId] },
            job: jobId
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [candidateId, recruiterId],
                job: jobId
            });
            await conversation.save();
        }

        await conversation.populate('participants', 'fullName email');
        await conversation.populate('job', 'title company');

        return res.status(200).json({
            success: true,
            message: "Conversation started successfully",
            conversation
        });
    } catch (error) {
        console.error("Error starting conversation:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.id;

        // Verify user is part of this conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'fullName')
            .sort({ createdAt: 1 });

        // Mark messages as read for the current user
        await Message.updateMany(
            { 
                conversation: conversationId, 
                sender: { $ne: userId },
                isRead: false 
            },
            { 
                isRead: true, 
                readAt: new Date() 
            }
        );

        return res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        const senderId = req.id;

        // Verify user is part of this conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(senderId)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Create new message
        const message = new Message({
            conversation: conversationId,
            sender: senderId,
            content: content.trim()
        });

        await message.save();
        await message.populate('sender', 'fullName');

        // Update conversation's last message
        conversation.lastMessage = message._id;
        await conversation.save();

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            message
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Mark conversation as read
export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.id;

        await Message.updateMany(
            { 
                conversation: conversationId, 
                sender: { $ne: userId },
                isRead: false 
            },
            { 
                isRead: true, 
                readAt: new Date() 
            }
        );

        return res.status(200).json({
            success: true,
            message: "Messages marked as read"
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
