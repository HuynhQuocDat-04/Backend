const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    // Đảm bảo có dòng này để không bị lỗi 404 khi gọi API đơn hàng
    app.use('/api/order', OrderRouter)
}

module.exports = routes