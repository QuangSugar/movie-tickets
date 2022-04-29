const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    maCumRap: {
      type: String,
      trim: true,
    },
    tenHeThongRap: {
      type: String,
    },
    logo: {
      type: String,
    },
    maHeThongRap: {
      type: String,
      trim: true,
      unique: true,
    },
    lstCumRap: {
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

module.exports = mongoose.model("Rap", userSchema);
