const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();
const flash=require('connect-flash');
const session=require('express-session')
const passport=require('passport');
// DB config
const db = require("./config/keys").MongoURI;
//Passport config
require('./config/passport')(passport);
// Connect To Mongo
app.use(express.urlencoded({extended:false}));
//Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,

}));
app.use(passport.initialize());
app.use(passport.session());
//Connect Flash
app.use(flash());
//Global Vars
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  next();
});
 
mongoose
  .connect(db, {
    useCreateIndex: true,
    useFindAndModify: true,
    // useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology:true,
  })
  .then(()=>{
      console.log("MongoDb connected");
  })
  .catch((e) => {
    console.log(e);
  });
const PORT = process.env.PORT || 5000;
// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
