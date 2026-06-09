import express from "express";
import {
    createPoll,
    getPoll,
    getMyPolls,
    closePoll,
} from "../polls/controllers/poll.controller.js";

const router = express.Router();

router.post("/", createPoll);
router.get("/:pollId", getPoll);
router.post("/my-polls", getMyPolls);
router.put("/:pollId/close", closePoll);

export default router;