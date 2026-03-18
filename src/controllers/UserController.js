const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req, res) => {
    try {
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) { return res.status(404).json({ message: e }) }
}

const loginUser = async (req, res) => {
    try {
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true, secure: false, sameSite: 'strict'
        })
        return res.status(200).json(newResponse)
    } catch (e) { return res.status(404).json({ message: e }) }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const response = await UserService.updateUser(userId, req.body)
        return res.status(200).json(response)
    } catch (e) { return res.status(404).json({ message: e }) }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) { return res.status(404).json({ message: e }) }
}

// Hàm mới: Controller xóa nhiều người dùng
const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) { return res.status(404).json({ message: e }) }
}

const getAllUsers = async (req, res) => {
    try {
        const response = await UserService.getAllUsers()
        return res.status(200).json(response)
    } catch (e) { return res.status(404).json({ message: e }) }
}

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        const response = await UserService.getDetailUser(userId)
        return res.status(200).json(response)
    } catch (e) { return res.status(404).json({ message: e }) }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token
        if (!token) return res.status(200).json({ status: 'ERR', message: 'The token is required' })
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) { return res.status(404).json({ message: e }) }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({ status: 'OK', message: 'Logout successfully' })
    } catch (e) { return res.status(404).json({ message: e }) }
}

module.exports = {
    createUser, loginUser, updateUser, deleteUser, getAllUsers, getDetailUser, refreshToken, logoutUser,
    deleteMany // Export hàm mới
}