import {
    createPollService,
    getPollDetail,
    getMyPollsService,
    closePollService,
} from "../services/poll.service.js"

export const createPoll = async (req, res) => {
    try {
        const result = await createPollService(req.body);
        return res.status(201).json({
            success: true,
            data: result,
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const getMyPolls = async (req, res) => {
    try {
        const { creatorTokens } = req.body;
        const polls = await getMyPollsService(creatorTokens);
        return res.status(200).json({
            success: true,
            data: polls,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const getPoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const poll = await getPollDetail(pollId);
        return res.status(200).json({
            success: true,
            data: poll,
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const closePoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { creatorToken } = req.body;
        const poll = await closePollService(pollId, creatorToken);
        
        // Broadcast that poll was closed
        const io = req.app.get('io');
        io.to(pollId).emit('poll:status', { pollId, status: 'CLOSED' });

        return res.status(200).json({
            success: true,
            message: "Poll closed successfully",
            data: poll,
        });
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message,
        });
    }
}