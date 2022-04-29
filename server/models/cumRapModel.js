const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    maCumRap: {
      type: String,
      trim: true,
    },
    tenCumRap: {
      type: String,
    },
    danhSachRap: [
      {
        maRap:{
            type:String
        },
        tenRap:{
            type: String
        }
      },
    ]
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

module.exports = mongoose.model("CR", userSchema);
