const router = require("express").Router();
const ticket = require("../controllers/ticketCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/DatVe", ticket.datVe);

router.post("/TaoLichChieu", ticket.taoLich);


router.get("/LayDanhSachPhongVe", ticket.layVe);



module.exports = router;
