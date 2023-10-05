// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// session configuration

const session = require("express-session");
const MongoStore = require("connect-mongo");
const DB_URL = process.env.MONGODB_URI;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // for how long is the user logged in -> this would be one day
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DB_URL,
    }),
  })
);
// end of session configuration

// passport config

const User = require("./models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((userFromDB) => {
      done(null, userFromDB);
    })
    .catch((err) => {
      done(err);
    });
});

// register the local strategy (login with username and password)
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }).then((userFromDB) => {
      if (userFromDB === null) {
        done(null, false, { message: "Wrong Credentials" });
      }
      if (!bcrypt.compareSync(password, userFromDB.password)) {
        return done(null, false, { message: "Wrong Credentials" });
      }
      return done(null, userFromDB);
    });
  })
);

app.use(passport.initialize());
app.use(passport.session());

// end of passport config

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const mealdb = require("./routes/mealdb");
app.use("/myresapi/mealdb", mealdb);

const user = require("./routes/user");
app.use("/myresapi/user", user);

const recipes = require("./routes/recipes");
app.use("/myresapi/recipes", recipes);

const auth = require("./routes/auth");
app.use("/myresapi/auth", auth);

const path = require("path");
app.use(express.static(path.join(__dirname, "/client/build")));

app.use((req, res) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/client/build/index.html");
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
