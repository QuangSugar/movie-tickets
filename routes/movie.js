const router = require("express").Router();
const movie = require("../controllers/movieCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.delete("/XoaPhim", movie.xoaPhim);

router.post("/ThemPhimUploadHinh", movie.themPhim)
;
router.put("/CapNhatPhim", movie.capNhatPhim);

router.get("/LayDanhSachPhim", movie.layPhim);

router.get("/LayThongTinPhim/:maPhim", movie.layThongTinPhim);

module.exports = router;
