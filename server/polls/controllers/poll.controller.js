import {
    createPollService,
} from "../services/poll.service.js"

export const createPoll = async (req, res) => {
    try {
        const result = await createPollService(req.body);

        return res.status(201).json({
            success: true,
            message: "Poll created successfully.",
            data: result,
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

