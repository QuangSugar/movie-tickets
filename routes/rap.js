const router = require("express").Router();
const rap = require("../controllers/rapCtrl");

router.get("/LayThongTinHeThongRap", rap.layRap);

router.get("/LayThongTinCumRapTheoHeThong", rap.layCum);

router.get("/LayThongTinLichChieuHeThongRap", rap.layLichChieu);
router.get("/LayThongTinLichChieuPhim", rap.layThongTin);

module.exports = router;
