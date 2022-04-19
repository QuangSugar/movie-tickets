const Rap = require("../models/rapModel");
const Cum = require("../models/cumRapModel");
const Movie = require("../models/movieModel");

const rapCtrl = {
  layRap: async (req, res) => {
    try {
      const res = await Rap.find();

      res.status(200).json(res);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  layCum: async (req, res) => {
    try {
      const res = await Cum.findOne({ maHeThongRap: red.params.maHeThongRap });

      res.status(200).json(res);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  layLichChieu: async (req, res)=>{
       try {
         const res = await Rap.findOne({
           maHeThongRap: red.params.maHeThongRap,
         });

         res.status(200).json(res);
       } catch (err) {
         return res.status(500).json({ msg: err.message });
       }
  },
  layThongTin: async (req, res)=>{
       try {
         const res = await Movie.findOne({
           maHeThongRap: red.params.maHeThongRap,
         });

         res.status(200).json(res);
       } catch (err) {
         return res.status(500).json({ msg: err.message });
       }
  }
};

module.exports = rapCtrl;
