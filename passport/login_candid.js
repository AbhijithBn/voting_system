var LocalStrategy=require('passport-local').Strategy;//handling strategies

var cand_User=require('../models/user');//access the databse content
var bCrypt = require('bcryptjs');//password authentications

// console.log("Entering login_candid.js");
module.exports=function(passport_candid){
   
    // console.log("entering function before localstrategy of candidate");
    passport_candid.use('candid_login', new LocalStrategy(//where login is name of local strategy being used in this example
    function(username, password, done) 
    { 
        // console.log("inside local strategy function of candidate");
        cand_User.findOne({'voterId':username}, 
        function(err, user) {
            // In case of any error, return using the done method 
            console.log(user);     
            if (err){
                console.log("there is an error",err);
                return done(err);
            }
            // Username does not exist, log error & redirect back
            if (!user){
                console.log('User Not Found with username '+username);
                return done(null, false);                 
            }
            // User exists but wrong password, log the error 
            if (!isValidPassword(user, password)){
                console.log('Invalid Password');
                return done(null, false);
            }
            // User and password both match, return user from 
            // done method which will be treated like success
            console.log("success logging in candidate in login_candid.js");
            // console.log(user);
            return done(null, user);
          }
        );
    }));

    var isValidPassword = function(user, password){
        // console.log(password,user.password);
        return bCrypt.compareSync(password, user.password);
    }
}
