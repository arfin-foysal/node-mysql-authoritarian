const express = require('express');
const { registration, verifyUser, login, forgotPassword, getresetPassword, ResetPassword, logout } = require('../controllers/userController');
const userRouter = express.Router()


userRouter.post('/registration',registration)
userRouter.get('/verify/:id/:token',verifyUser)
userRouter.post('/login',login)
userRouter.post('/forgot-password',forgotPassword)
userRouter.get('/reset-password/:id/:token',getresetPassword)
userRouter.post('/reset-password/:id/:token', ResetPassword)
userRouter.get('/logout', logout)


module.exports=userRouter;