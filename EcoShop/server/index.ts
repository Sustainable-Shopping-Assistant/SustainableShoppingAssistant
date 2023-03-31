import dotenv from "dotenv";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../database/models/user";

// Import the db connection
import db from "../database/index";

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(
  session({
    secret: "your_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30, // 30 minutes
    },
  })
);

// connect to db
db.once("open", () => {});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// ----  Routes ---- //
// Signup route
app.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !password || !user.password) {
    return res.status(400).send("Invalid email or password");
  }

  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send("Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
    expiresIn: "1d",
  });
  res.status(200).json({ token, userId: user._id, expiresIn: "1d" });
});


// Logout route
app.post("/logout", (req, res) => {
  // Clear the session cookie
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid");
    res.status(200).send("Logged out successfully");
  });
});

// Middleware for protected routes
declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.slice(7);
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");

    req.user = decoded;
    next();
  } catch (error) {
    console.log("i am here")
    res.status(400).send("Invalid token.");
  }
};

// Example protected route
app.get("/protected", isAuthenticated, (req: Request, res: Response) => {
  const decodedUser = req.user as string | jwt.JwtPayload;
  res.status(200).send("Access granted.");
});

//Me route
app.get("/me", isAuthenticated, (req: Request, res: Response) => {
  const decodedUser = req.user as string | jwt.JwtPayload;
  let userId;
  if (typeof decodedUser !== "string") {
    userId = decodedUser.id;
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found.");
      }
      res.status(200).json({ user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server error.");
    });
});

// ---- Catch all for routing ---- //
app.get("*", (req: Request, res: Response) => {
  res.sendFile(
    path.join(__dirname, "../client/dist/index.html"),
    (err: Error) => {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// ---- Set Port and Listen For Requests ---- //
const port = 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
