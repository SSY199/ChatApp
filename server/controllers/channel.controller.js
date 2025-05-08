import mongoose from "mongoose";
import User from "../models/auth.model.js";
import Channel from "../models/channel.model.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const validateMembers = await User.find({ _id: { $in: members } });

    if (validateMembers.length !== members.length) {
      return res.status(404).json({ message: "Some members not found" });
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();
    return res
      .status(201)
      .json({ message: "Channel created", channel: newChannel });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getChannels = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ members: userId }, { admin: userId }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ channels });
  } catch (error) {
    console.log(error);
  }
};
