
import Poll from "../../models/Poll.model.js";
import generateToken from "../../utils/generateToken.js";

export const createPollService = async (payload) => {
    const {
        question,
        options,
        duplicateCheck,
        expiresAt,
    } = payload;

    const uniqueOptions = [...new Set(options.map((item) => item.trim()))]

    if (uniqueOptions.length < 2) {
        throw new Error("At least two unique options are required")
    }

    const formattedOptions = uniqueOptions.map((text) => ({
        text
    }))

    const creatorToken = generateToken();

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
