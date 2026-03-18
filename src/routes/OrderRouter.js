const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authMiddleWare, authUserMiddleWare, authTokenMiddleWare } = require("../middleware/authMiddleware");

// Đường dẫn tạo đơn hàng: /api/order/create
router.post('/create', authUserMiddleWare, OrderController.createOrder);
router.get('/get-all-order', authMiddleWare, OrderController.getAllOrder);
router.put('/confirm-paid', authMiddleWare, OrderController.confirmPaidOrders);
router.get('/get-all-order/:id', authUserMiddleWare, OrderController.getDetailsOrder);
router.get('/get-details-order/:orderId', authTokenMiddleWare, OrderController.getOrderDetailsById);
router.delete('/cancel-order/:id', authTokenMiddleWare, OrderController.cancelOrderDetails);

module.exports = router;