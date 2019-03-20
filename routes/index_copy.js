var express=require('express');

//router to route this to app.js
var router=express.Router();
router.use(express.static('public'));

//accessing the database
var User=require('../models/user');//collection for voters
var candid_user=require('../models/candidate_model');//collection for candidates

//encryption of registration data
var bcrypt=require('bcryptjs');


var async=require('async');
var nodemailer=require('nodemailer');
var crypto=require('crypto');

module.exports=function(){

    //handling get request for voters
    router.get('/', function(req, res) {
        res.sendfile(__dirname+'/'+"layout.html");
    });

    //render voter registration page
    router.get('/voter_reg',function(req,res){
        res.sendFile(__dirname+'/'+'register_voter.html');
    })

    router.post('/voter_reg',function(req,res){

        async.waterfall([  //array of functions 
            function(done){
                crypto.randomBytes(8,function(err,buf){
                    var token= buf.toString('hex');
					done(err, token);
                });
            },
            function(token,done){
                const {firstname,lastname,email,phonenumber,aadhar}=req.body;
                console.log("Request BODY :",req.body);
                // console.log("firstname :",firstname,"lastname :",lastname,"email :",email ,"phonenumber :",phonenumber,"aadhar number :",aadhar,"dateofbirth :",dateofbirth,"gender :",gender);

                if (!firstname || !email || !phonenumber || !aadhar ) {
                    console.log( 'Please enter all fields' );
                }

                else{

                    User.findOne({'firstName':firstname}).then(user=>{
                        console.log("User :",user);
                        if(user){
                            console.log("User already exists");
                            res.sendFile(__dirname+'/'+"voter_login.html");
                        }
                        else{
                            var newUser = new User();
                            newUser.firstName = req.body.firstname;
                            newUser.lastName = req.body.lastname;
                            newUser.email = req.body.email;
                            newUser.phoneNumber = req.body.phonenumber;
                            newUser.aadharNumber = req.body.aadhar;
                            newUser.voterId=token;//random generated token which is assigned to voterID

                            console.log(newUser.lastName);
        
                            newUser.save(function(err){
                                if(err)
                                    throw err;

                                res.redirect('/voter_login')
                                //return done(null, newUser);
                            })
                        }
                    })
                }
            },
            function(token, user, done) 
			{
				const smtpTransport = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					auth: {
						type: 'OAuth2',
						user:'bnabhijithprojects@gmail.com',
						clientId: '580282575353-pmfljg4lgmbk7t58ropiadnl11qialfc.apps.googleusercontent.com',
						clientSecret: 'toMHecQzEbqaH6ETqHdHlIDD',
						refreshToken: '1/L_yZRrZ8p3i2pP1_Z8lIltW7FliOwKdC9J2OtBmubMU',
						accessToken: 'ya29.GlvCBqFrxsZnrZjagtZni1oqGdbC2bIsTO8J4GGZLFCae4o-R-boAP0MPZrURDLWnvAsiTll7FCyNKr4Bk8uEX_ptLsN2UxRUK6JQknoea6MwL1I-hTry0UQTftk'
					}
				});
				var mailOptions = {
					to: user.email,
					from: 'bnabhijithprojects@gmail.com',
					subject: 'Voter ID ',
					text: 'Your voter ID is :' + token 
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					console.log('mail sent');
					req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
					done(err, 'done');
				});
			}
            
        ], function(err) {
			if (err) return next(err);
			res.redirect('/forgot');
		});

        
        
        
        

    })

    //render candidate registration page
    router.get('/candid_reg',function(req,res){
        res.sendFile(__dirname+'/'+'candid_reg.html');
    })
    
    //handling post request for voters


    //handling post request for voters
    router.post('/candid_reg',function(req,res){
        const {firstname,lastname,email,phonenumber,aadharnumber}=req.body;
        console.log("Firstname :",req.body);
        // console.log("firstname :",firstname,"lastname :",lastname,"email :",email ,"phonenumber :",phonenumber,"aadhar number :",aadhar,"dateofbirth :",dateofbirth,"gender :",gender);

        if (!firstname || !email || !phonenumber || !aadharnumber ) {
		    console.log( 'Please enter all fields' );
        }
        
        else{

            candid_user.findOne({'candidate.firstName':firstname}).then(user=>{
                console.log("User :",user);
                if(user){
                    console.log("User already exists");
                    res.sendFile(__dirname+'/'+"candidate_login.html");
                }
                else{
                    var newCand = new candid_user();
                    newCand.firstName = req.body.firstname;
                    newCand.lastName = req.body.lastname;
                    newCand.email = req.body.email;
                    newCand.phoneNumber = req.body.phonenumber;
                    newCand.aadharNumber = req.body.aadharnumber;
                    console.log(newCand.lastName);

                    newCand.save(function(err){
                        if(err)
                            throw err;
                        //return done(null, newCand);
                    })

                }
            })
        }

    })

    router.get('/voter_login',function(req,res){
        res.sendFile(__dirname+'/'+'voter_login.html')
    })


    
    return router;

}