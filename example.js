/**
 * Module dependencies.
 */
var express = require('express'),
    a1 = require('./a1');
var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  app.use(express.session({
    secret: 'your secret here'
  }));
  
  app.use(a1);
  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger({
    format: ':method :url'
  }));

  a1.add_helpers(app);

  app.dynamicHelpers({
    flash: function(req, res) {
      return req.flash();
    },

    session: function(req, res) {
      return req.session;
    }
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(res,res){ res.send("<html><body>Welcome Please Click <a href=\"/app\">Here</a></body></html>") });
app.get('/app/', a1.require, function(req,res){res.send("<html><body>Welcome</body></html>") });

app.post('/login', function(req, res) {
  if (req.body.email != '' && req.body.password != '') {
    req.auth.set_user({
      email: req.body.email
    });
    res.redirect(req.session.redirectTo || '/app/');
  } else {
    req.flash('error', 'Bad Email or Password');
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  if (req.authenticated) {
    res.redirect('/app/');
  } else {
    res.render('sessions/login', {layout:false});
  }
});

app.get('/logout', function(req, res) {
  req.auth.logout();
  res.redirect('/');
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000, "0.0.0.0");
  console.log("Express server listening on port %d", app.address().port)
}