var express=require('express');

//router to route this to app.js
var router=express.Router();
router.use(express.static('public'));

//accessing the database
var User=require('../models/user');//collection for voters

//encryption of registration data
var bcrypt=require('bcryptjs');

var bodyParser=require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
var body_parse=bodyParser.json()

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
}

module.exports=function(passport){

    //handling get request for voters
    router.get('/', function(req, res) {
        // res.sendFile(__dirname+'/'+"layout.html");
        res.render('layout');
    });

    //render voter registration page
    router.get('/voter_reg',function(req,res){
        res.render('registervoter');
    })

    router.post('/voter_reg',function(req,res){
                const {firstname,lastname,email,phonenumber,voterid,password,password2,hasVoted}=req.body;
                console.log("Request BODY :",req.body);
                // console.log("firstname :",firstname,"lastname :",lastname,"email :",email ,"phonenumber :",phonenumber,"aadhar number :",aadhar,"dateofbirth :",dateofbirth,"gender :",gender);

                if (!firstname || !email || !phonenumber ) {
                    console.log( 'Please enter all fields' );
                }
                if (password!=password2){
                    console.log("The passwords do not match");
                }
                if(password.length<6){
                    console.log("Password must be atleast 6 characters long");
                }
                else{

                    User.findOne({'voterId':voterid}).then(user=>{
                        console.log("User :",user);
                        if(user){
                            console.log("User already exists");
                            res.render('voter_login');
                        }
                        else{
                            var newUser = new User();
                            newUser.firstName = req.body.firstname;
                            newUser.lastName = req.body.lastname;
                            newUser.email = req.body.email;
                            newUser.phoneNumber = req.body.phonenumber;
                            newUser.voterId=req.body.voterid;
                            newUser.password=req.body.password;
                            newUser.constituency=req.body.const;
                            newUser.isCandid='false';
                            newUser.hasVoted='false';
                            console.log(newUser.lastName);

                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) 
                                        throw err;
                                newUser.password = hash;
                                console.log(hash);
                                newUser.save().then(user => {
                                    console.log(
                                        'success_msg',
                                        'You are now registered and can log in'
                                    );
                                    res.redirect('/voter_login');
                                    })
                                    .catch(err => console.log(err));
                                });
                            });
        
                            
                        }
                    })
                }
            
    });


    router.get('/voter_login',function(req,res){
        res.render('voter_login');
    })

    router.post('/login', passport.authenticate('voter_login', {
		successRedirect: '/voting',
		failureRedirect: '/voter_login' 
	}));


    //render the voting page incase of correct authentication of the user
	router.get('/voting', isLoggedIn, function(req, res){
        User.find({constituency:req.user.constituency,isCandid:'true'}).then(user=>{
            if(user){
                res.render('voting',{voter:req.user,candidate:user});
            }
            else{
                console.log("No candidate");
            }
        })
        
    });
    //

    router.get('/voted',function(req,res){
        res.render('voted');
    })
    
    router.post('/voted',function(req,res){
        // console.log(typeof req.user.firstName);
        var name=req.user.firstName;
        User.findOneAndUpdate({'firstName':req.user.firstName},{hasVoted:'true'},
        function(user){
            console.log("User in database :",user);
            if(user){
                // console.log("Your vote has been saved");
                user.save();
            }
            else{
                // console.log("Error saving vote to database");
            }
        });
        res.redirect('/voted');

    })


    router.post('/clicked',function(req,res){
        console.log("REQUEST IS :",req.body.firstname);
        console.log(typeof req.body.firstname);
        User.findOneAndUpdate({firstName:req.body.firstname},{hasVoted:'true'},
        function(user){
            console.log("User in database :",user);
            if(user){
                console.log("Update successful");
                user.save();
            }
            else{
                console.log("Error in updating voting information");
            }
        });
    })
    //----------------------------------------------------------------------------------------------------------------------------------------------------------
    
    //handling get request for voters
    router.get('/candid_login', function(req, res) {
        res.render('voter_login');
    });

    //render voter registration page
    router.get('/candid_reg',function(req,res){
        res.render('candid_reg');
    })

    router.post('/candid_reg',function(req,res){
                const {firstname,lastname,email,phonenumber,voterid,password,password2,secret,party,constituency}=req.body;
                console.log("Request BODY :",req.body);
                // console.log("firstname :",firstname,"lastname :",lastname,"email :",email ,"phonenumber :",phonenumber,"aadhar number :",aadhar,"dateofbirth :",dateofbirth,"gender :",gender);

                if (!firstname || !email || !phonenumber ) {
                    console.log( 'Please enter all fields' );
                }
                if (password!=password2){
                    console.log("The passwords do not match");
                }
                if(password.length<6){
                    console.log("Password must be atleast 6 characters long");
                }
                if(secret!='youcandid'){
                    console.log("You are not authorised to be a candidate");
                    res.redirect('/voter_reg');
                }
                else{

                    User.findOne({'voterId':voterid}).then(user=>{
                        if(user){
                            console.log("User already exists");
                            res.render('voter_login');
                        }
                        else{
                            var newCand = new User();
                            newCand.firstName = req.body.firstname;
                            newCand.lastName = req.body.lastname;
                            newCand.email = req.body.email;
                            newCand.phoneNumber = req.body.phonenumber;
                            newCand.voterId=req.body.voterid;
                            newCand.password=req.body.password;
                            newCand.party=req.body.party;
                            newCand.constituency=req.body.const;
                            newCand.isCandid='true';
                            newCand.hasVoted='false';
                            console.log(newCand.lastName);

                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newCand.password, salt, (err, hash) => {
                                    if (err) 
                                        throw err;
                                newCand.password = hash;
                                console.log(hash);
                                newCand.save().then(user => {
                                    console.log(
                                        'success_msg',
                                        'You are now registered and can log in'
                                    );
                                    res.redirect('/candid_login');
                                    })
                                    .catch(err => console.log(err));
                                });
                            });
        
                            
                        }
                    })
                }
            
    });


    
    return router;

}
