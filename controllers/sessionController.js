const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErr");
const passport = require("passport");

const registerShow = (req, res) => {
   res.render("register");
};

const registerDo = async (req, res, next) => {
   if (req.body.password != req.body.password1) {
      req.flash("errors", "The passwords entered do not match.");
      return res.render("register", { errors: req.flash("errors") });
   }
   try {
      await User.create(req.body);
   } catch (e) {
      if (e.constructor.name === "ValidationError") {
         parseVErr(e, req);
      } else if (e.name === "MongoServerError" && e.code === 11000) {
         req.flash("errors", "That email address is already registered.");
      } else {
         return next(e);
      }
      return res.render("register", { errors: req.flash("errors") });
   }
   res.redirect("/");
};

const logoff = (req, res) => {
   req.session.destroy(function (err) {
      if (err) {
         console.log(err);
      }
      res.redirect("/");
   });
};

const logonShow = (req, res) => {
   if (req.user) {
      return res.redirect("/");
   }
   res.render("logon");
};

const logonDo = (req, res, next) => {
   //passport.authenticate(): A function that returns a new middleware function that expects the req, res, and next objects
   passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
   })(req, res, next);
};

module.exports = {
   registerShow,
   registerDo,
   logoff,
   logonShow,
   logonDo,
};
