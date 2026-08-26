const { Router } = require('express')
const {
    registerController,
    loginController,
    refreshTokenController,
    logoutController,
    getmeController,
} = require('../controller/auth.controller')
const { authUser } = require('../middlewares/auth.middleware')

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register', registerController)


/**
 * @route POST /api/auth/login
 * @description Login an existing user
 * @access Public
 */

authRouter.post('/login', loginController)
authRouter.post('/refresh', refreshTokenController)


/**
 * @route GET /api/auth/logout
 * @description Logout a user and invalidate the refresh token
 * @access Public
 */

authRouter.get('/logout', logoutController  )

/**
 * @route GET /api/auth/get-me
 * @description Get the details of the logged in user
 * @access Private
 */


authRouter.get('/get-me', authUser, getmeController)

module.exports =authRouter