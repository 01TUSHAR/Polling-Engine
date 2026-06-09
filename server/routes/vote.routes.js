import express from "express";
import { castVote, getResults } from "../votes/controllers/vote.controller.js";

const router = express.Router();

router.post("/:pollId", castVote);
router.get("/:pollId/results", getResults);

export default router;
