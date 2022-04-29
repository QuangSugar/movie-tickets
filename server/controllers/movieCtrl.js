const Movies = require("../models/movieModel");


const movieCtrl = {
  themPhim: async (req, res) => {
    try {
      const { tenPhim, trailer, hinhAnh, moTa, ngayChieu } = req.body;
      if ((!tenPhim, !trailer, !hinhAnh, !moTa, !ngayChieu))
        return res.status(400).json({ msg: "Please fill in all fields." });

      const mv = await Movies.findOne({ tenPhim });
      if (mv)
        return res.status(400).json({ msg: "This movie already exists." });

      const newMV = new Movies({
        tenPhim,
        trailer,
        hinhAnh,
        moTa,
        ngayChieu,
      });

      await newMV.save();

      res.status(200).json({
        tenPhim,
        trailer,
        hinhAnh,
        moTa,
        ngayChieu,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  capNhatPhim: async (req, res) => {
    try {
      const { maPhim,tenPhim, trailer, hinhAnh, moTa, ngayChieu } = req.body;
      if ((!tenPhim, !trailer, !hinhAnh, !moTa, !ngayChieu))
        return res.status(400).json({ msg: "Please fill in all fields." });

       await Movies.findOneAndUpdate(
        { id : maPhim },
        {
          tenPhim,
          trailer,
          hinhAnh,
          moTa,
          ngayChieu,
        }
      );


      res.status(200).json({
        tenPhim,
        trailer,
        hinhAnh,
        moTa,
        ngayChieu,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  layPhim: async (req, res) => {
    try {
      const movie = await Movies.find();

      res.status(200).json(movie);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  layThongTinPhim: async (req, res) => {
    try {
      const movie = await Movies.findById(req.params.maPhim);

      res.status(200).json(movie);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  xoaPhim: async (req, res) => {
    try {
      await Users.findOneAndDelete({ tenPhim: req.params.tenPhim });

      res.status(200).json("Deleted Success!");
    } catch (err) {
      return res.status(500).json({ data: err.message });
    }
  }
};



module.exports = movieCtrl;
