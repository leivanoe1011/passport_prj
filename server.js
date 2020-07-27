
var express = require("express");

// Initialize express
var app = express();


// Import Handlebars
var exphbs = require('express-handlebars')

// Passport
// import the passport module and the express-session, 
// both of which we need to handle authentication
var passport = require("passport");

// passport has to save a user ID in the session 
// and it uses this to manage retrieving the user details when needed
var session = require("express-session");


// This extracts the entire body part of an incoming 
// request and exposes it in a format that is easier to work with. 
// In this case, we will use the JSON format.
var bodyParser = require('body-parser');


// load is no longer a function, we must use config
var env = require('dotenv').config()
// var env = require("dotenv").load();



var PORT = process.env.PORT || 8001;


//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// express session and passport session add them both as middleware.
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions


// Models
// Here, we are importing the models, and then calling the Sequelize sync function.
var models = require("./app/models");

// This will give us the option to restructure our Database based
// ON changes to the Sequelizer
var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "development") {
  // This will allow us to change our Database every time we initiate the server
  // IN the test environment
  syncOptions.force = true; 
}

//Sync Database
models.sequelize.sync(syncOptions).then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});


//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');



// Routes
// pass app as an argument
// passing the passport will validate the user
var authRoute = require('./app/routes/auth.js')(app,passport)


//load passport strategies
// models.user ... user will mirror the lowercase "user" defined in the user model
require('./app/config/passport/passport.js')(passport, models.user);


app.get('/', function(req, res) {
 
    res.send('Welcome to Passport with Sequelize');
 
});
 
 
app.listen(PORT, function(err) {
 
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});


