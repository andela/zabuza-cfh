/**
 * Module dependencies.
 */
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const mongoose = require('mongoose'),
  User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');
const avatars = require('./avatars').all();

/**
 * Auth callback
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.authCallback = function (req, res) {
  res.redirect('/chooseavatars');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Logout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
  res.redirect('/');
};

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */
exports.checkAvatar = function (req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec(function (err, user) {
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const user = new User(req.body);
        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save((err) => {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user,
            });
          }
          req.logIn(user, (err) => {
            if (err) return next(err);
            const token = jwt.sign(user, config.secret, {
              expiresIn: 10080 // in seconds
            });
            // return res.redirect('/#!/');
            res.json({ success: true, token: `JWT ${token}` });
          });
        });
      } else {
        res.json({ success: false, message: 'User already exist' });
        // return res.redirect('/#!/signup?error=existinguser');
      }
    });
  } else {
    // return res.redirect('/#!/signup?error=incomplete');
    res.json({ success: false, message: 'You must enter all field' });
  }
};

exports.login = function (req, res, next) {
  if (req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (err) {
        return res.status(400).json({ success: false, message: 'Error trying to log user in' });
      }
      if (!existingUser) {
        return res.status(400).json({ success: false, message: 'User does not exist' });
      }
      const password = req.body.password;
      if (bcrypt.compareSync(password, existingUser.hashed_password)) {
        req.logIn(existingUser, (err) => {
          if (err) return res.status(400).json({ success: false, message: 'User does not exist' });
          const token = jwt.sign(existingUser, config.secret, {
            expiresIn: 10080 // in seconds
          });
          // return res.redirect('/#!/');
          res.status(200).json({ success: true, token: `JWT ${token}` });
        });
      } else {
        res.status(401).json({ success: false, message: 'Wrong email or password' });
      }
    });
  } else {
    // return res.redirect('/#!/signup?error=incomplete');
    res.status(400).json({ success: false, message: 'You must enter all field' });
  }
};

/**
 * Assign avatar to user
 */
exports.avatars = (req, res) => {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i++) {
            if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            console.log('Validated donation');
            user.donations.push(req.body);
            user.premium = 1;
            user.save();
          }
        });
    }
  }
  res.send();
};

/**
 *  Show profile
 */
exports.show = function (req, res) {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};


 // Get all user in the dtatabase
 exports.searchUsers = (req, res) => {
   // get all the users from mongoDB
   User.find({}, (err, users) => {
     if (err) {
       return res.status(400).json({ err });
     }
     // return res.json(users);
     return res.status(200).json(users);
  });
 };

 // send an invitation email to user
 exports.invitePlayers = (req, res) => {
   const fromEmail = new helper.Email('no-reply@cfh.com');
   const toEmail = new helper.Email(req.body.email);
   const subject = 'Invitation to an ongoing round of Cards for Humanity';
   const content = new helper.Content('text/plain',
   `Hello ${req.body.name}, 
   ${req.body.from} has sent you an invite to join them in a game of CFH
    click on the link below or copy/paste it in your browser url to join the game
    ${req.body.urlLink}
    
    br
    CFH`
   );
   const mail = new helper.Mail(fromEmail, subject, toEmail, content);
   const request = sg.emptyRequest({
     method: 'POST',
     path: '/v3/mail/send',
     body: mail.toJSON()
   });
   sg.API(request, (error) => {
     if (error) {
       return res.json({ error });
     }
     return res.json({ sent: true });
   });
 };

  /**
   *
   *Finds all the users in the database
   * @param {string} req
   * @param {object} res
   */
exports.all = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.render('error', {
        status: 500,
      });
    } else {
      res.jsonp(users);
    }
  });
};
