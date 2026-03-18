const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post('/log-out', userController.logoutUser);
router.put("/update-user/:id", authUserMiddleWare, userController.updateUser);
router.delete("/delete-user/:id", authUserMiddleWare, userController.deleteUser);
router.get("/get-all", authMiddleWare, userController.getAllUsers);
router.get("/get-detail/:id", authUserMiddleWare, userController.getDetailUser);
router.post("/refresh-token", userController.refreshToken);

// Tuyến đường mới: Xóa nhiều người dùng
router.post('/delete-many', authMiddleWare, userController.deleteMany);

module.exports = router;