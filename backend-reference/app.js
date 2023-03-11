const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const io = require("socket.io")(5510, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false,
  },
});
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", () => {});
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {});
});

// Connection to DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => console.log("Server running on port:" + PORT));
  })
  .catch((e) => console.log(e));

const { User, Post, Image } = require("./models");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({
  storage: Storage,
}).single("image");

// const upload = multer({ dest: "uploads" });

// Routes

app.get("/", (req, res) => {
  res.send("helpukraine API");
});

app.get("/api/images/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const doesImageExist = await Image.findOne({ user_id: userId });
    res.json(doesImageExist);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/images", upload, async (req, res, next) => {
  const data = {
    image: req.file.path,
  };
  cloudinary.uploader
    .upload(data.image)
    .then((result) => {
      const image = new Image({
        user_id: req.body.user_id,
        img: result.url,
      });
      const response = image.save();
      res.status(200).send({
        message: "success",
        result,
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: "failure",
        error,
      });
    });
});

app.delete("/api/images/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Image.findByIdAndDelete(id);

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
  }
});

// -- POST /api/users/signup    |   User signup (creates new user)
app.post("/api/users/signup", async (req, res) => {
  const newUserData = req.body;
  try {
    const isUserExist = await User.findOne({ email: newUserData.email });

    if (!isUserExist) {
      const newUser = new User(newUserData);

      const createdUser = await newUser.save();

      res.json({
        message: "User created",
        user: createdUser,
      });
    } else {
      res.json({ message: "User with given email already exists" });
    }
  } catch (error) {
    console.log(error);
  }
});

// -- POST /api/users/login     |   User login (connects existing user)
app.post("/api/users/login", async (req, res) => {
  const userData = req.body;

  try {
    const user = await User.findOne(userData);

    if (user) {
      res.json({ message: "User founded", user });
    } else {
      res.json({ message: "User with given email and password not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

// -- POST /api/movies          |   Movie creation (creates new movie)
app.post("/api/posts", async (req, res) => {
  const {
    user_id,
    user_type,
    name_surname,
    address,
    description,
    phone,
    post_type,
    image,
  } = req.body;

  const newPost = {
    user_id,
    user_type,
    name_surname,
    address,
    description,
    phone,
    post_type,
    image,
  };

  try {
    const post = new Post(newPost);
    await post.save();

    res.json({ message: "Post added" });
  } catch (error) {
    console.log(error);
  }
});

// -- GET /api/movies           |   Movie listing (retrieving all movies)
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find({});

    const availablePosts = [...posts].map((post) => {
      const normalizedPost = post.toObject();

      normalizedPost.userId = normalizedPost.user_id.toString();
      delete normalizedPost.user_id;

      return normalizedPost;
    });

    res.json(availablePosts);
  } catch (error) {
    console.log(error);
  }
});

// -- GET /api/users/:id         |   User information (retrieving user information and his movies and orders)
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    const allPosts = await Post.find({});
    const userPosts = allPosts
      .filter((post) => post.user_id.toString() === userId)
      .map((post) => ({
        ...post.toObject(),
        userId: post.user_id.toString(),
      }));

    // const ordersWithMoviesData = [...orders].reduce((total, order) => {
    //   let newOrder;

    //   allMovies.forEach((movie) => {
    //     if (order.movie_id.toString() === movie._id.toString()) {
    //       newOrder = {
    //         movieOwnerId: movie._id.toString(),
    //         movie_name: movie.movie_name,
    //         movie_category: movie.movie_category,
    //         movie_rent_price: movie.movie_rent_price,
    //         return_days: order.return_days,
    //       };
    //     }
    //   });

    //   total.push(newOrder);

    //   return total;
    // }, []);

    res.json({
      ...user.toObject(),
      posts: userPosts,
    });
  } catch (error) {
    console.log(error);
  }
});

// -- PUT /api/movies/:id       |   Movie update and order creation
app.put("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const newData = req.body;
  try {
    const user = await User.find({
      _id: userId,
    });

    await User.findByIdAndUpdate(userId, newData);

    res.json({ message: "User updated" });
  } catch (error) {
    console.log(error);
  }
});

// -- PUT /api/movies/:id       |   Movie update and order creation
app.put("/api/posts/:id", async (req, res) => {
  const postId = req.params.id;
  const newData = req.body;
  try {
    const post = await Post.find({
      _id: postId,
    });

    await Post.findByIdAndUpdate(postId, newData);

    res.json({ message: "Post updated" });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
  }
});
