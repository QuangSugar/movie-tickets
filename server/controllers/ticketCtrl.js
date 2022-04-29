const DS = require("../models/DanhSachDatVe");


const ticketCtrl = {
  datVe: async (req, res) => {
    try {
      const { maLichChieu, danhSachVe } = req.body;
      if ((!maLichChieu, !danhSachVe))
        return res.status(400).json({ msg: "Please fill in all fields." });

      const ds = await DS.findOne({ maLichChieu });
      if (ds)
        return res.status(400).json({ msg: "This shedule already exists." });

      const newShedule = new DS({
        maLichChieu,
        danhSachVe,
      });

      await newShedule.save();

      res.status(200).json({
        maLichChieu,
        danhSachVe,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  taoLich: async (req, res) => {
    try {
      const { maPhim, ngayChieu,GioChieu, maRap, giaVe } = req.body;
      if ((!maPhim, !ngayChieu,!GioChieu,!maRap, !giaVe))
        return res.status(400).json({ msg: "Please fill in all fields." });


      const newShedule = new DS({
        maPhim,
        ngayChieu,
        GioChieu,
        maRap,
        giaVe,
      });

      await newShedule.save();

      res.status(200).json({
        maPhim,
        ngayChieu,
        GioChieu,
        maRap,
        giaVe,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  layVe: async (req, res) => {
    try {
      const maVe = await DS.findOne({ maVe: req.params.maVe });
      
      res.status(200).json(maVe);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};



module.exports = ticketCtrl;
