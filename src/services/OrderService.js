const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("./EmailService")

const generateOrderCode = () => {
    const now = new Date()
    const yy = String(now.getFullYear()).slice(-2)
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const mi = String(now.getMinutes()).padStart(2, '0')
    const ss = String(now.getSeconds()).padStart(2, '0')
    const rand = Math.floor(10 + Math.random() * 90)
    return `DH-${yy}${mm}${dd}-${hh}${mi}${ss}-${rand}`
}

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, taxPrice = 0, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    { _id: order.product, countInStock: { $gte: order.amount } },
                    { $inc: { countInStock: -order.amount, selled: +order.amount } },
                    { new: true }
                )
                if (productData) {
                    return { status: 'OK', message: 'SUCCESS' }
                } else {
                    return { status: 'ERR', message: 'ERR', id: order.product }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                const arrId = newData.map((item) => item.id)
                resolve({ status: 'ERR', message: `Sản phẩm với id: ${arrId.join(',')} không đủ hàng` })
            } else {
                let orderCode = generateOrderCode()
                let existsOrderCode = await Order.findOne({ orderCode })
                while (existsOrderCode) {
                    orderCode = generateOrderCode()
                    existsOrderCode = await Order.findOne({ orderCode })
                }

                const createdOrder = await Order.create({
                    orderItems, shippingAddress: { fullName, address, city, phone },
                    paymentMethod,
                    orderCode,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                    user: user,
                    isPaid,
                    paidAt
                })
                if (createdOrder) {
                    // Gửi email xác nhận đặt hàng (Nodemailer)
                    if (email) {
                        await EmailService.sendEmailCreateOrder(email, orderItems)
                    }
                    resolve({ status: 'OK', message: 'success', data: createdOrder })
                }
            }
        } catch (e) { reject(e) }
    })
}

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id,
                $or: [{ isCanceled: { $exists: false } }, { isCanceled: false }]
            }).sort({ createdAt: -1 })
            resolve({ status: 'OK', message: 'SUCCESS', data: order })
        } catch (e) { reject(e) }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 })
            resolve({ status: 'OK', message: 'SUCCESS', data: orders })
        } catch (e) { reject(e) }
    })
}

const getOrderDetailsById = (orderId, requester = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId)
            if (!order) {
                return resolve({ status: 'ERR', message: 'Đơn hàng không tồn tại' })
            }

            const isOwner = String(order.user) === String(requester?.requesterId)
            if (!requester?.requesterIsAdmin && !isOwner) {
                return resolve({ status: 'ERR', message: 'Bạn không có quyền truy cập đơn hàng này' })
            }

            resolve({ status: 'OK', message: 'SUCCESS', data: order })
        } catch (e) { reject(e) }
    })
}

const cancelOrderDetails = (id, data, requester = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(id)
            if (order === null) {
                return resolve({ status: 'ERR', message: 'Đơn hàng không tồn tại' })
            }

            const isOwner = String(order.user) === String(requester?.requesterId)
            if (!requester?.requesterIsAdmin && !isOwner) {
                return resolve({ status: 'ERR', message: 'Bạn không có quyền hủy đơn hàng này' })
            }

            if (order.isCanceled) {
                return resolve({ status: 'OK', message: 'Đơn hàng đã được hủy trước đó', data: order })
            }

            order.isCanceled = true
            order.canceledAt = new Date()
            await order.save()

            resolve({ status: 'OK', message: 'success', data: order })
        } catch (e) { reject(e) }
    })
}

const confirmPaidOrders = (orderIds) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validIds = Array.isArray(orderIds) ? orderIds : []
            if (!validIds.length) {
                return resolve({ status: 'ERR', message: 'Danh sách đơn hàng không hợp lệ' })
            }

            const result = await Order.updateMany(
                {
                    _id: { $in: validIds },
                    paymentMethod: 'chuyen_khoan',
                    isCanceled: { $ne: true },
                    isPaid: false
                },
                {
                    $set: {
                        isPaid: true,
                        paidAt: new Date()
                    }
                }
            )

            resolve({
                status: 'OK',
                message: 'success',
                data: {
                    matchedCount: result.matchedCount || 0,
                    modifiedCount: result.modifiedCount || 0
                }
            })
        } catch (e) { reject(e) }
    })
}

module.exports = { createOrder, getDetailsOrder, getAllOrder, getOrderDetailsById, cancelOrderDetails, confirmPaidOrders }