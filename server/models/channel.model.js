import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: { type: String,
       required: true
       },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// channelSchema.pre("validate", function(next) {
//   if (!this.members.includes(this.admin)) {
//     this.invalidate("admin", "Admin must be a member of the channel");
//   }
//   next();
// });

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
