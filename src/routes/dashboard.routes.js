import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/:channelId").get(getChannelStats)
router.route("/v/:channelId").get(getChannelVideos)



export default router