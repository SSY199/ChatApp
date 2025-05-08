import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createChannel, getChannels } from "../controllers/channel.controller.js";


const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-channels", verifyToken, getChannels);

export default channelRoutes;