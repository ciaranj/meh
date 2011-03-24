module.exports = a1;

/**
 * This is the middleware layer that you'll use 
 * at a global level. Via something like app.use()
 *
 * @see Middleware
**/
function a1(req, res, next) {
    // be self-aware.
  if (req.auth) return next();
  
  if (req.session && req.session.user) {
    req.session.touch();
    req.authenticated = true;
  } else {
    req.authenticated = false;
  }
  
  req.auth = {
    set_user: function(user) {
      req.session.user = user;
      req.session.save();
    },
    
    get_user: function() {
      return req.session.user;
    },
    
    logout: function(callback) {
      req.session.user = undefined;
      req.session.save();
    }
  };

  return next(null, req, res);
};

/**
 * The path to which users should be redirected to 
 * if not already authenticated on a1.require()
**/
a1.login_path = '/login';

/**
 * This is the per-route middleware to say "this route 
 * needs to be authenticated".
**/
a1.require = function(req, res, next) {
  if(!req.authenticated) {
    req.session.redirectTo = req.url;
    res.redirect(a1.login_path);
  } else {
    next();
  }
};

/**
 * This add on a few view level helpers, such as figuring 
 * out if the user is authenticated and getting the actual 
 * user object.
**/
a1.add_helpers = function(app) {
  app.dynamicHelpers({
    authenticated: function(req) {
      return req.authenticated;
    },
    user: function(req) {
      return req.auth.get_user();
    }
  });
};