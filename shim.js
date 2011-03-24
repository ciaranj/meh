// This is what isn't currently shipped with connect-auth a simple 
// utility wrapper to hide the primitives connect-auth provides.


/**
 * Takes in the path to which users should be redirected to 
 * if not already authenticated on a1.require()
**/
module.exports = function( login_path ) {
  return function(req, res, next) {
    if(!req.isAuthenticated()) {
      res.redirect(a1.login_path + "?redirectUrl="+ escape(request.url) );
    } else {
      next();
    }
  }
}