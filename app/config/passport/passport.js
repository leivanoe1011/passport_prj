
// This file will contain our passport strategies
// Used to secure passwords
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {

    var User = user;
    var LocalStrategy = require('passport-local').Strategy;

    console.log("In Passport JS");
    console.log(User);

    // define our custom strategy with our instance of the LocalStrategy
    passport.use('local-signup', new LocalStrategy(
 
        {
            // by default, local strategy uses username and password, 
            // we will override with email
            usernameField: 'email',
            passwordField: 'password',
            // allows us to pass back the entire request to the callback
            // which is particularly useful for signing up
            passReqToCallback: true 
     
        },

        // In this function, we will handle storing a user's details.
        // The email will be validated to see if it exists
        // password will be encrypted
        // done will be returned to the call
        function(req, email, password, done) {
 
            // hashed password generating function
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
             
            };

            // we check to see if the user already exists, and if not we add them
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user){

                // If the user exists, than we exit
                if (user)
                {
 
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
 
                }
                else {
                    var userPassword = generateHash(password);

                    // req.body object contains the input from our signup form
                    var data = {
                        email: email,
                        password: userPassword,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName
                    };
 
                    // If the user does not exist, than 
                    User.create(data).then(function(newUser, created){
                        if(!newUser){
                            return done(null, false);
                        }

                        if(newUser){
                            return done(null, newUser);
                        }
                    });
                }
            });

        }
     
    ));


    // serialize
    // In this function, we will be saving the user id to the session
    passport.serializeUser(function(user, done) {
    
        done(null, user.id);
    
    });

    // deserialize user 
    passport.deserializeUser(function(id, done) {
    
        // we use the Sequelize findById promise to get the user, 
        // and if successful, an instance of the Sequelize model is returned.
        // User.findById(id).then(function(user) {
        User.findByPk(id).then(function(user) {
    
            if (user) {
    
                done(null, user.get());
    
            } else {
    
                done(user.errors, null);
    
            }
    
        });
    
    });


    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
    
        {
    
            // by default, local strategy uses username and password, we will override with email
    
            usernameField: 'email',
    
            passwordField: 'password',
    
            passReqToCallback: true // allows us to pass back the entire request to the callback
    
        },
    
    
        function(req, email, password, done) {
    
            var User = user;
    
            // compares the password entered with the bCrypt comparison 
            // method since we stored our password with bcrypt
            var isValidPassword = function(userpass, password) {
    
                return bCrypt.compareSync(password, userpass);
    
            }
    
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
    
                if (!user) {
    
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
    
                }
    
                if (!isValidPassword(user.password, password)) {
    
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
    
                }
    
    
                var userinfo = user.get();
                return done(null, userinfo);
    
    
            }).catch(function(err) {
    
                console.log("Error:", err);
    
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
    
            });
    
    
        }
    
    ));

}



















