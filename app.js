var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var session = require('express-session');

var User = require("./models/User");
var Post = require("./models/post");

var UserRoutes = require("./routes/users");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Passport Config
require('./config/passport')(passport);

// Connect DB
var url = process.env.DATABASEURL || "mongodb+srv://varun2000:varun2000@webdev-sdnkq.mongodb.net/project?retryWrites=true&w=majority"

mongoose.connect(url,{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
    }, () => {
        console.log("DB CONNECTED!!");
    });

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Back button cached sessions destroy
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
    
// Global variables
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  
  app.use(UserRoutes);
  
  app.listen(process.env.PORT || 3000, () => {
    console.log("The Project server has started!!!!");
  });