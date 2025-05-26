import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createChannel,
  deleteChannel,
  getChannelMessages,
  getChannels,
} from "../controllers/channel.controller.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-channels", verifyToken, getChannels);
channelRoutes.get(
  "/get-channel-messages/:channelId",
  verifyToken,
  getChannelMessages
);
channelRoutes.delete("/delete-channel/:channelId", verifyToken, deleteChannel);

export default channelRoutes;
