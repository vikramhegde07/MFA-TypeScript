import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    mfaEnabled: {
        type: Boolean,
        default: false,
    },

    mfaSecret: {
        type: String,
        default: null,
    },

    mfaTempSecret: {
        type: String,
        default: null,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // 24 hours = 86400 seconds
    },
});

// Ensure TTL index is created
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const User = mongoose.model("User", userSchema);
