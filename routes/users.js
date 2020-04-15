var express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load models
const User = require('../models/User');
const Post = require('../models/post');


//Routes
router.get("/", (req, res) => {
    res.render('landing');
});

router.post("/", isLoggedIn, (req, res) => {
  var post = req.body.post;
  var author = {
		id: req.user._id,
	};
  var newPost = { post:post, author:author }
  Post.create(newPost, (err, newlycreated) => {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/posts');
      }
  })
});

router.get("/posts", isLoggedIn, (req, res) => {
    Post.find({}, (err, allPosts) => {
      if(err) {
          console.log(err);
      } else {
          res.render("posts", { posts: allPosts });
      }
    })
});

router.post('/deletepost', isLoggedIn, (req, res) => {
	Post
		.findByIdAndDelete(req.body.id)
		.then((doc) => {
			res.redirect('/posts');
		})
		.catch((err)=> res.redirect('/posts'));
})

router.get("/login", (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local',
	{
    	successRedirect: '/',
    	failureRedirect: '/login',
    	failureFlash: true
  	}), function(req, res){
});

router.get("/signup", (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('signup', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('signup', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered! Login to continue.'
                  );
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});


//Authentication Middleware

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
    }
    req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

module.exports = router;