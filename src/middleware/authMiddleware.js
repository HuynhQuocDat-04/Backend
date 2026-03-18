const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token is required', status: 'ERROR' })

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({ message: 'The authentication failed', status: 'ERROR' })
        }
        if (user?.isAdmin) {
            req.user = user
            next()
        } else {
            return res.status(403).json({ message: 'No permission', status: 'ERROR' })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1]
    const userId = req.params.id
    if (!token) return res.status(401).json({ message: 'Token is required', status: 'ERROR' })

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            // Đổi từ 404 sang 401 để dễ debug
            return res.status(401).json({ message: 'The authentication failed', status: 'ERROR' })
        }
        // For routes without :id in params, a valid token is enough.
        if (!userId || user?.isAdmin || user?.id === userId) {
            req.user = user
            next()
        } else {
            return res.status(403).json({ message: 'No permission', status: 'ERROR' })
        }
    });
}

const authTokenMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token is required', status: 'ERROR' })

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({ message: 'The authentication failed', status: 'ERROR' })
        }
        req.user = user
        next()
    })
}

module.exports = { authMiddleWare, authUserMiddleWare, authTokenMiddleWare }