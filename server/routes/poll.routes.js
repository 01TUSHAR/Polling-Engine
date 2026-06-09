import express from "express";
import {
    createPoll,
} from "../polls/controllers/poll.controller.js";

const router = express.Router();

router.post("/", createPoll);


export default router;