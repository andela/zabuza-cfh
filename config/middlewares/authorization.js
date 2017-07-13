/* global jwt secret */
/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
  }
};

/**
 * Article authorizations routing middleware
 */
// exports.article = {
//     hasAuthorization: function(req, res, next) {
//         if (req.article.user.id != req.user.id) {
//             return res.send(401, 'User is not authorized');
//         }
//         next();
//     }
// };

// Routing process of the middleware to verify a user token
exports.checkToken = (req, res, next) => {
  // checking header or url parameters or post parameters for token
  if (req.url.startsWith('/auth')) return next();
  const token = req.cookies.token;
  // decoding the token
  if (token) {
    // verifies secret and checks
    jwt.verify(token, secret, function (error, decoded) {
      if (error) {
        return res.status(403).json({
          message: 'Failed to authenticate token.'
        });
      }   // if the authentication process was succesful, save to request for use in other routes
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token available
    // return an error
    return res.status(200).send({
      message: 'No token returned.'
    });
  }
};
