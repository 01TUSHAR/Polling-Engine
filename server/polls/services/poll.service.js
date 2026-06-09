import Poll from "../../models/Poll.model.js";
import generateToken from "../../utils/generateToken.js";

export const createPollService = async (payload) => {
    const {
        question,
        options,
        duplicateCheck,
        expiresAt,
        creatorToken: existingToken
    } = payload;

    const uniqueOptions = [...new Set(options.map((item) => item.trim()))]

    if (uniqueOptions.length < 2) {
        throw new Error("At least two unique options are required")
    }

    const formattedOptions = uniqueOptions.map((text) => ({
        text
    }))

    const creatorToken = existingToken || generateToken();

    const poll = await Poll.create({
        question: question.trim(),
        options: formattedOptions,
        duplicateCheck: (duplicateCheck && duplicateCheck.length > 0) ? duplicateCheck : "DEVICE",
        creatorToken,
        expiresAt: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    return {
        pollId: poll._id,
        creatorToken
    }
}

export const getPollDetail = async (pollId) => {
    const poll = await Poll.findById(pollId);
    if (!poll) throw new Error("Poll not found");
    return poll;
}

export const getMyPollsService = async (creatorTokens) => {
    if (!creatorTokens?.length) return [];
    return await Poll.find(
        { creatorToken: { $in: creatorTokens } },
        { creatorToken: 0 }
    ).sort({ createdAt: -1 });
}

export const closePollService = async (pollId, creatorToken) => {
    const poll = await Poll.findOneAndUpdate(
        { _id: pollId, creatorToken },
        { status: 'CLOSED' },
        { new: true }
    );
    if (!poll) throw new Error("Unauthorized or poll not found");
    return poll;
}