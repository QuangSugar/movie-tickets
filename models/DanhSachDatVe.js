const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    maLichChieu: {
      type: Number,
      trim: true,
    },
    danhSachVe: {
      type: Array,
    },
    // avatar: {
    //   type: String,
    //   default:
    //     "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", userSchema);
