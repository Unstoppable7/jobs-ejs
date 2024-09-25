const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
   logonShow,
   logonDo,
   registerShow,
   registerDo,
   logoff,
} = require("../controllers/sessionController");

router.route("/register").get(registerShow).post(registerDo);
router.route("/logon").get(logonShow).post(logonDo);
router.route("/logoff").post(logoff);

module.exports = router;
