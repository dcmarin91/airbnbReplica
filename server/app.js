const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require("./model/User");
const cors = require("cors");
const cookieSession = require("cookie-session");

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/airbnb", { useNewUrlParser: true });

app.use(cookieSession({
  secret: "una_cadena_secreta",
  maxAge: 2 * 24 * 60 * 60 * 1000
}));

app.use(cors());
app.use(express.json());


// authentication middleware
app.use(async (req, res, next) => {
    const userId = req.session.userId;
    if (userId) {
      const user = await User.findOne({ _id: userId });
      console.log(user);
      if (user) {
        res.locals.user = user;
      } else {
        delete req.session.userId;
      }
    }
  
    next();
});

//Requerir Usuario
const requireUser = (req, res, next) => {
    if (!res.locals.user) {
      return res.redirect("/login");
    }
    next();
};


app.get('/login', async (req, res, next) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch(err) {
    next(err);
  }
})

app.post('/', async (req, res, next) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    };
    try {
      const response = await User.create(user);
      res.json(response);
    } catch(err) {
      next(err);
    }
  })

app.listen(3001, () => console.log('Listening on port 3001!'));