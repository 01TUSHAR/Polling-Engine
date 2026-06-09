import { createVoteService, getPollResultsService } from "../services/vote.service.js";

export const castVote = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { optionId, deviceToken } = req.body;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Save the vote
        const result = await createVoteService({ pollId, optionId, deviceToken, ipAddress });

        // Fetch the latest results to broadcast
        const results = await getPollResultsService(pollId);

        // Emit real-time update to everyone in the poll room
        const io = req.app.get('io');
        io.to(pollId).emit('poll:update', results);

        return res.status(201).json({
            success: true,
            message: "Vote casted successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getResults = async (req, res) => {
    try {
        const { pollId } = req.params;
        const result = await getPollResultsService(pollId);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
