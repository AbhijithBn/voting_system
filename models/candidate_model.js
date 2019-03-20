var mongoose=require('mongoose');
module.exports = mongoose.model('candid_users',
{
    firstName:String,
    lastName:String,
    email:String,
    phoneNumber:Number,
    aadharNumber:Number,
    voterId:String,
    password:String,
    party:String,
    constituency:String
})