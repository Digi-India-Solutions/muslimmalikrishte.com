const mongoose = require('mongoose');

const EmailVerifySchema = mongoose.Schema({
    email:{
        type:String,
    },
    otp:{
        type:String,
    }
})

module.exports = mongoose.model('EmailV',EmailVerifySchema);