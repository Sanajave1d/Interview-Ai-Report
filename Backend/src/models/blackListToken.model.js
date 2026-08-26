const mongoose = require('mongoose')

const blackListTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required : [true ,'token is required']
    },
    expiresAt:{
        type: Date,
        required : [true ,'expiresAt is required']
    }
},{
    timestamps:true
})

blackListTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const blackListTokenModel = mongoose.model("blackListToken", blackListTokenSchema)

module.exports = {blackListTokenModel}