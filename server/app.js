const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require("./model/User");
const Homedata = require("./model/Homedata");
const cors = require("cors");
const cookieSession = require("cookie-session");
const jwt = require("jsonwebtoken");
const multer  = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/airbnb", { useNewUrlParser: true });

var s3 = new aws.S3({
  credentials : {
    accessKeyId: process.env.AWS_ACCESKEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  },
  region: "us-west-2"
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'airbnbreplica91',
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

app.use(cookieSession({
  secret: "una_cadena_secreta",
  maxAge: 2 * 24 * 60 * 60 * 1000
}));

app.use(cors());
app.use(express.json());

app.get('/', async (req, res, next) => {
  try {
    const homes = await Homedata.find();
    res.json(homes);
  } catch(err) {
    next(err);
  }
})


// authentication middleware
app.use(async (req, res, next) => {
    const userId = req.session.userId;
    if (userId) {
      const user = await User.findOne({ _id: userId });
      if (user) {
        res.locals.user = user;
      } else {
        delete req.session.userId;
      }
    }

    next();
});

//Requerir Usuario
const requireUser = async (req, res, next) => {
    const token = req.get("Authorization");
    if (token) {
      try {
        console.log("Token: ", token);
        const decoded = await jwt.verify(token, process.env.SECRET_KEY || "secret key");
        console.log("Decoded: ", decoded);
        if (decoded.userId) {
          const user = await User.findOne({ _id: decoded.userId });
          if (user) {
            res.locals.user = user;
            return next();
          }
        } else {
          res.status(401).json({ error: "Invalid authorization token" });
        }
      } catch (e) {
        console.log(e);
        res.status(401).json({ error: "Invalid authorization token" });
      }
    } else {
      res.status(401).json({ error: "Not authorized" });
    }
};

app.get('/login', requireUser, async (req, res, next) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch(err) {
    next(err);
  }
})

app.post("/register", async (req, res, next) => {
  try {
    const user = await User.create({ email: req.body.email, password: req.body.password });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET || "secret key");
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body.email, req.body.password);
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET || "secret key");
      res.json({ token });
    } else {
      res.status(401).json({ error: "User or password is invalid" });
    }
  } catch (err) {
    next(err);
  }
});

//Upload New Place
app.post('/profile', upload.single('image'), async (req, res, next) => {
  try {
    await Homedata.create({
      placeType: req.body.place_value,
      guests: req.body.guests,
      adress: req.body.adress,
      city: req.body.city,
      state: req.body.state,
      cost: req.body.cost,
      marker_lat: req.body.marker_lat,
      marker_lng: req.body.marker_lng,
      description: req.body.description,
      image: req.file.location, 
    });
  } catch (err) {
    next(err);
  }
});

app.listen(3001, () => console.log('Listening on port 3001!'));