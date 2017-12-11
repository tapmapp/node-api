var express = require('express');

var router = express.Router();
var csrf = require('csurf');
var path = require('path');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// DATA BASE CONNECTION
var mongoose = require('mongoose');
mongoose.connect('127.0.0.1:27017/wholadb');

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

// DEFINE ROUTES
var brands = require('./routes/brands');
var campaigns = require('./routes/campaigns');
var categories = require('./routes/categories');
var clients = require('./routes/clients');
var merchants = require('./routes/merchants');
var products = require('./routes/products');
var sales = require('./routes/sales');
var stores = require('./routes/stores');

var login = require('./routes/login');

// APP INITIALIZATION
var app = express();
var server = require('http').createServer(app);
var io = require('./socket/socket').initialize(server);

app.set('socketio', io);

// VIEWS ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false, saveUnitialized: false }))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ROUTES
app.use('/brands', brands);
app.use('/campaigns', campaigns);
app.use('/categories', categories);
app.use('/clients', clients);
app.use('/merchants', merchants);
app.use('/products', products);
app.use('/sales', sales);
app.use('/stores', stores);

app.use('/login', login);

// 404 ERROR
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// ERROR HANDLER
app.use(function(err, req, res, next) {
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // RENDER ERROR PAGE
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;
