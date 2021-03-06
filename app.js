var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session =require('express-session')
var db=require('./config/connection')
var hbs=require('express-handlebars')





var usersRouter=require('./routes/user/user')
var AdminRouter=require('./routes/admin/admin')
var productRouter=require('./routes/admin/product');
var cartRouter=require('./routes/user/cart')
var OrderRouter=require('./routes/admin/order')
var OfferRouter=require('./routes/admin/offer')
const fileUpload = require('express-fileupload');

var app = express();

// session

app.use(session({ secret: "key", cookie: { maxAge: 60000000 } }))
app.use((req, res, next) => {
  res.set('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials'}))
db.connect((err)=>{

  console.log("......................................................................................................");
  if(err){
    console.log("Databasse Error"+err);
  }
  else{
    console.log("DATABASE CONNECTED SUCCESSFULLY");
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use('/', usersRouter);
app.use('/admin',AdminRouter)
app.use('/product',productRouter)
app.use('/cart',cartRouter)
app.use('/order',OrderRouter)
app.use('/offer',OfferRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

 
});

module.exports = app;
