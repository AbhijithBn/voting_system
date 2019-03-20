var login= require('./login_voter');
var User=require('../models/user');//collection for voters

module.exports=function(passport){


    //serialization and de-serialization of users
    passport.serializeUser(function(user, done) {
        // console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });
  
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            // console.log('Deserializing user: ',user);
            done(err, user);
        });
    });

    //passport strategies for passport
    login(passport);

}