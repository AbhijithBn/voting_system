var login_candid= require('./login_candid');
var candid_User=require('../models/user');//collection for voters
// console.log("user outside serialisation is ",user);

module.exports=function(passport_candid){

    console.log("inside serialization function");
    //serialization and de-serialization of users
    passport_candid.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport_candid.deserializeUser(function(id, done) {
        candid_User.findById(id, function(err, user) {
          done(err, user);
        });
      });

    //passport strategies for passport
    login_candid(passport_candid);

}