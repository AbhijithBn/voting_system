//this schema is for VOTERS
var mongoose=require('mongoose');
module.exports = mongoose.model('users',
{
    firstName:{type: String, required: true},
    lastName:String,
    email:{type: String, unique: true, required: true},
    phoneNumber:{type: Number, required: true},
    voterId:{type: String, unique: true, required: true},
    password:String,
    constituency:String,
    party:String,
    isCandid:String,
    hasVoted:String,
    votecount:Number
})

