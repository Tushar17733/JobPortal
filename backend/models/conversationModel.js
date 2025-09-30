import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map()
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
conversationSchema.index({ participants: 1, job: 1 });
conversationSchema.index({ lastMessage: 1 });

export default mongoose.model("Conversation", conversationSchema);
