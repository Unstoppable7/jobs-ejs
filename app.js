const express = require("express");
require("express-async-errors");

const app = express();
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

require("dotenv").config(); // to load the .env file into the process.env object

//middleware that manages user sessions in an Express application
const session = require("express-session");

/* Middleware that provides session storage based on MongoDB.
* By passing session as an argument to require(“connect-mongodb-session”), we are telling
* connect-mongodb-session to use the session management system provided by express-session.
*/
const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;

//A new instance of MongoDBStore is being created here, which is the storage where the sessions will be stored.
const store = new MongoDBStore({
   // may throw an error, which won't be caught
   uri: url,
   collection: "mySessions",
});

//This is an event handler that listens for the “error” event in the store instance.
store.on("error", function (error) {
   console.log(error);
});

//These are the parameters passed to express-session to configure session behavior
const sessionParms = {
   secret: process.env.SESSION_SECRET,
   resave: true,
   saveUninitialized: true,
   store: store,
   cookie: { secure: false, sameSite: "strict" },
};

//if the application is running in production, the session cookie won’t work unless SSL is present
if (app.get("env") === "production") {
   app.set("trust proxy", 1); // trust first proxy
   sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));

const passport = require("passport");
const passportInit = require("./passport/passportInit");

//This registers our local Passport strategy, and sets up the serializeUser and deserializeUser functions onto the passport object
passportInit();
//sets up Passport to work with Express and sessions
app.use(passport.initialize());
//sets up an Express middleware that runs on all requests, checks the session cookie for a user id, and if it finds one, deserializes and attaches it to the req.user property
app.use(passport.session());

//middleware for Express-based web applications that provides an easy way to store flash messages in the session
app.use(require("connect-flash")());

//res.locals is an object in Express that provides a space to store data that will be available to the view during the life cycle of the current request.
app.use(require("./middleware/storeLocals"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");
app.use("/secretWord", auth, secretWordRouter);

app.use((req, res) => {
   res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
   res.status(500).send(err.message);
   console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
   try {
      await require("./db/connect")(process.env.MONGO_URI);
      app.listen(port, () =>
         console.log(`Server is listening on port ${port}...`)
      );
   } catch (error) {
      console.log(error);
   }
};

start();
