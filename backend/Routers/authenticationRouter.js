const express = require('express');
const authenticationRouter = express.Router();
const {RegisterUser,LoginUser,LogoutUser,forgotPasswordUser,verifyTokenOTP,updatePasswordOTP,verifyEmailUser,verifyEmailOTP} = require('../controllers/auth.controllers.js');

authenticationRouter.route('/register').post(RegisterUser);
authenticationRouter.route('/Login').post(LoginUser);
authenticationRouter.route('/Logout').post(LogoutUser);
authenticationRouter.route('/forgotPassword').post(forgotPasswordUser);
authenticationRouter.route('/verifyEmail').post(verifyEmailUser); //1
authenticationRouter.route('/verifyEmailOTP').post(verifyEmailOTP); //2
authenticationRouter.route('/verifyToken').post(verifyTokenOTP);
authenticationRouter.route('/updatePassword').post(updatePasswordOTP);

module.exports=authenticationRouter;