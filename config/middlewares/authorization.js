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
  // const token = req.cookies.token;
  const token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTk2ZTJmN2UyZDlhODgxOGJiODk2ZTk2Iiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiZG9uYXRpb25zIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJoYXNoZWRfcGFzc3dvcmQiOiJpbml0IiwiZW1haWwiOiJpbml0IiwibmFtZSI6ImluaXQiLCJwcm92aWRlciI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsImRvbmF0aW9ucyI6dHJ1ZSwiaGFzaGVkX3Bhc3N3b3JkIjp0cnVlLCJlbWFpbCI6dHJ1ZSwibmFtZSI6dHJ1ZSwicHJvdmlkZXIiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sInBhdGhzVG9TY29wZXMiOnt9LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiZG9uYXRpb25zIjpbXSwiX192IjowLCJoYXNoZWRfcGFzc3dvcmQiOiIkMmEkMTAkR2xXVmJlWVlCTy84Rk9DNFRmbGkvLno3RjFPelhxQVM3bEdBTlRIang2NUJ1ckk2Zk5LTDYiLCJlbWFpbCI6InJhbmRvbUByYW5kb20uY29tIiwibmFtZSI6InJhbmRvbSB1c2VyIiwicHJvdmlkZXIiOiJsb2NhbCIsIl9pZCI6IjU5NmUyZjdlMmQ5YTg4MThiYjg5NmU5NiJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTAwMzk4NjM2LCJleHAiOjE1MDA0MDg3MTZ9.MVklnkQjQ1D_hX-EWiTzUIktI_rhnMSJ-GYT9BPIurg';
  // decoding the token
  if (token) {
    // verifies secret and checks
    // jwt.verify(token, secret, function (error, decoded) {
    //   if (error) {
    //     return res.status(403).json({
    //       message: 'Failed to authenticate token.'
    //     });
    //   }   // if the authentication process was succesful, save to request for use in other routes
    //   req.decoded = decoded;
    //   next();
    // });
    next();
  } else {
    // if there is no token available
    // return an error
    return res.status(200).send({
      message: 'No token returned.'
    });
  }
};
