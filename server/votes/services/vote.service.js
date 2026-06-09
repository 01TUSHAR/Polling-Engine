import mongoose from "mongoose";
import Vote from "../../models/Vote.model.js";
import Poll from "../../models/Poll.model.js";

export const createVoteService = async (payload) => {
    const { pollId, optionId, deviceToken, ipAddress } = payload;

    // 1. Verify if the poll exists and is active using findOne (more specific)
    const poll = await Poll.findById(pollId);
    if (!poll) {
        throw new Error("Poll not found");
    }

    if (poll.status !== "ACTIVE") {
        throw new Error("This poll is no longer active");
    }

    // 2. Verify if the poll has expired
    if (new Date() > new Date(poll.expiresAt)) {
        throw new Error("This poll has expired");
    }

    // 3. Verify if the option exists within the poll
    const option = poll.options.id(optionId);
    if (!option) {
        throw new Error("Invalid option selected");
    }

    // 4. Check for duplicate votes (Optimized with indices)
    if (poll.duplicateCheck === "DEVICE" && deviceToken) {
        const existingVote = await Vote.findOne({ pollId, deviceToken });
        if (existingVote) throw new Error("You have already voted in this poll");
    } else if (poll.duplicateCheck === "IP" && ipAddress) {
        const existingVote = await Vote.findOne({ pollId, ipAddress });
        if (existingVote) throw new Error("A vote has already been cast from this IP address");
    }

    // 5. Create the vote record and increment counts atomically
    const [vote] = await Promise.all([
        Vote.create({ pollId, optionId, deviceToken, ipAddress }),
        Poll.updateOne(
            { _id: pollId, "options._id": optionId },
            { 
                $inc: { 
                    "options.$.voteCount": 1,
                    "totalVoteCount": 1 
                } 
            }
        )
    ]);

    return vote;
};

export const getPollResultsService = async (pollId) => {
    const poll = await Poll.findById(pollId).select("options totalVoteCount");
    if (!poll) throw new Error("Poll not found");

    // Map to the same format as the old aggregation for compatibility
    return poll.options.map(opt => ({
        _id: opt._id,
        count: opt.voteCount || 0
    }));
};
