import mongoose from "mongoose"

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    voteCount: {
        type: Number,
        default: 0
    }
})

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: {
        type: [optionSchema],
        validate: [
            (arr) => arr.length >= 2,
            "Minimum two options required",
        ]
    },
    status: {
        type: String,
        enum: ["ACTIVE", "CLOSED"],
        default: "ACTIVE",
    },
    duplicateCheck: {
        type: String,
        enum: ["DEVICE", "IP"],
        default: "DEVICE"
    },
    creatorToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        default: () =>
            new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    totalVoteCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;