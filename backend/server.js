import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import User from "./model/user.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import { fileURLToPath } from "url";
import path, { resolve } from "path";
import multer from "multer";
import PlaceModel from "./model/place.js";
import BookingModel from "./model/Booking.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "uwb3bu3453in97473nedjufhusiehui";

const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
});

app.get('/', (req, res) => {
  res.send("hello world")
})

app.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email: email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({ userDoc });
        }
      );
    } else {
      res.json("Pass not valid");
    }
  } else {
    res.json("Not yet registered");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json(null);
    }

    jwt.verify(token, jwtSecret, async (err, userData) => {
      if (err) {
        return res.status(401).json(null);
      }
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});


app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.send({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;

  if (!link || link.trim() === "") {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const newName = Date.now() + ".jpg";
    await imageDownloader.image({
      url: link,
      dest: path.join(__dirname, "uploads", newName),
    });

    res.json(`${newName}`);
  } catch (error) {
    res.status(500).json({ error: "Failed to download and save image" });
  }
});

const photosMiddleware = multer({ dest: "uploads" });

app.post("/uploads", photosMiddleware.array("photos", 100), (req, res) => {
  const fileNames = req.files.map((file) => file.filename);
  res.json({ uploadedFiles: fileNames });
});

app.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    description,
    addedPhotos,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    perks,
    price
  } = req.body;

  if (token) {
    jwt.verify(token, jwtSecret, async (err, userData) => {
      if (err) throw err;

      const placeDoc = await PlaceModel.create({
        owner: userData.id,
        title,
        address,
        description,
        photos: addedPhotos,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        perks,
        price,
      });
      res.json(placeDoc);
    });
  }
});

app.get('/places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await PlaceModel.find({ owner: id }));
  });
});


app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const place = await PlaceModel.findById(id);
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: 'Could not find the place' });
  }
});


app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    description,
    addedPhotos,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    perks,
    price,
  } = req.body

  jwt.verify(token, jwtSecret, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await PlaceModel.findById(id)
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  })
})

app.post('/bookings', (req, res) => {
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;

  const { token } = req.cookies;


  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  jwt.verify(token, jwtSecret, (err, userData) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const userId = userData.id;

    BookingModel.create({ place, checkIn, checkOut, numberOfGuests, name, phone, price, user: userId })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to create booking' });
      });
  });
});


app.get('/bookings', async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, async (err, userData) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const bookings = await BookingModel.find({ user: userData.id })
      res.json(bookings);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
