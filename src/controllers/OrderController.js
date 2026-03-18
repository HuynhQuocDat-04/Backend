const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = req.body
        if (!paymentMethod || !itemsPrice || shippingPrice === undefined || !totalPrice || !fullName || !address || !city || !phone || !user) {
            return res.status(200).json({ status: 'ERR', message: 'Vui lòng điền đầy đủ thông tin' })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({ status: 'ERR', message: 'UserId là bắt buộc' })
        }
        const response = await OrderService.getDetailsOrder(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const response = await OrderService.getAllOrder()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getOrderDetailsById = async (req, res) => {
    try {
        const orderId = req.params.orderId
        const requesterId = req.user?.id
        const requesterIsAdmin = req.user?.isAdmin
        if (!orderId) {
            return res.status(200).json({ status: 'ERR', message: 'OrderId là bắt buộc' })
        }
        const response = await OrderService.getOrderDetailsById(orderId, { requesterId, requesterIsAdmin })
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        const requesterId = req.user?.id
        const requesterIsAdmin = req.user?.isAdmin
        const data = req.body
        if (!orderId) {
            return res.status(200).json({ status: 'ERR', message: 'OrderId là bắt buộc' })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data, { requesterId, requesterIsAdmin })
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const confirmPaidOrders = async (req, res) => {
    try {
        const { orderIds } = req.body
        if (!Array.isArray(orderIds) || !orderIds.length) {
            return res.status(200).json({ status: 'ERR', message: 'orderIds là bắt buộc' })
        }
        const response = await OrderService.confirmPaidOrders(orderIds)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = { createOrder, getDetailsOrder, getAllOrder, getOrderDetailsById, cancelOrderDetails, confirmPaidOrders }