var express=require('express');

//router to route this to app.js
var router=express.Router();
router.use(express.static('public'));

//accessing the database
var User=require('../models/user');//collection for voters

//encryption of registration data
var bcrypt=require('bcryptjs');

var bodyParser=require('body-parser');

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
                const {firstname,lastname,email,phonenumber,voterid,password,password2}=req.body;
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
        User.find({constituency:req.user.constituency}).then(user=>{
            if(user){
                res.render('voting',{voter:req.user,candidate:user});
            }
            else{
                console.log("No candidate");
            }
        })
        
	});

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
                        console.log("Candidate :",user);
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


// <!-- <h1 id="heading">Welcome to Voting Page</h1>

//     <p id="profile"></p>

//     <script>
//         document.getElementById('heading').onload=function(){displayuser()};
//         function displayuser(){
//             document.getElementById('profile').innerHTML= <%=user.firstname%>
//         }
//     </script> -->