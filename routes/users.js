const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const passport=require('passport');
// Login Page
router.get("/login", (req, res) => {
  res.render("Login");
});
// Register Page
router.get("/register", (req, res) => {
  res.render("Register");
});
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //    Check required field
  if (!email || !name || !password || !password2) {
    errors.push({ msg: "Please fill all the fields" });
  }
  // Check password matching
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Passwords should be atleast 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // res.send('pass');
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User Exists
        errors.push({ msg: "User is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        //Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Set password to hash
            newUser.password = hash;
            //Save user
            newUser.save().then((user) => {
                req.flash('success_msg','You are now registered and can login');
              res.redirect("/users/login")
              }).catch((e) => {
                console.log(e);
            });
          });
        });
      }
    });
  }
});
router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
  successRedirect:'/dashboard',
  failureRedirect:'/users/login',
  failureFlash:true,

  })(req,res,next)
})
//Logout Handle
router.get("/logout",(req,res)=>{
  req.logout();
  req.flash('success_msg','You are successfully logged out');
  res.redirect("/users/login");
})

module.exports = router;
