const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    heThongRapChieu: {
      type: Array,
      trim: true,
    },
    maPhim: {
      type: Number,
    },
    tenPhim: {
      type: String,
    },
    biDanh: {
      type: String,
    },
    trailer: {
      type: String,
    },
    hinhAnh: {
      type: String,
    },
    moTa: {
      type: String,
    },
    hot: {
      type: Boolean,
    },
    dangChieu: {
      type: Boolean,
    },
    sapChieu: {
      type: Boolean,
    },
    ngayKhoiChieu: {
      type: String,
    },
    danhGia: {
      type: Number,
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

module.exports = mongoose.model("movie", userSchema);
