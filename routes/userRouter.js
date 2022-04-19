const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/DangKy', userCtrl.register)

router.post("/ThemNguoiDung", userCtrl.addUser);

router.post('/DangNhap', userCtrl.login)

router.post('/refresh_token', userCtrl.getAccessToken)

router.post('/forgot', userCtrl.forgotPassword)

router.post('/reset', auth, userCtrl.resetPassword)

router.post("/ThongTinTaiKhoan", userCtrl.getUserInfor);

router.get("/LayDanhSachNguoiDung", userCtrl.getUsersAllInfor);

router.get('/logout', userCtrl.logout)

router.put("/CapNhatThongTinNguoiDung", userCtrl.updateUser);

router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateUsersRole)

router.delete("/XoaNguoiDung/:TaiKhoan",  userCtrl.deleteUser);


// Social Login
router.post('/google_login', userCtrl.googleLogin)

router.post('/facebook_login', userCtrl.facebookLogin)


module.exports = router