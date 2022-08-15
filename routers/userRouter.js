const express = require('express');
const { registration, verifyUser, login, forgotPassword, getresetPassword, ResetPassword, logout, allUser } = require('../controllers/userController');
const upload = require('../middlewares/imageUpload');

const userRouter = express.Router()


userRouter.post('/registration',  upload.single('avater'),registration)
userRouter.get('/verify/:id/:token',verifyUser)
userRouter.post('/login',login)
userRouter.post('/forgot-password',forgotPassword)
userRouter.get('/reset-password/:id/:token',getresetPassword)
userRouter.post('/reset-password/:id/:token', ResetPassword)
userRouter.get('/logout', logout)
userRouter.get('/all-user', allUser)



module.exports=userRouter;