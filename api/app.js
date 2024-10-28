import express from "express";
import cors from 'cors';
import dotenv from "dotenv"
import connectDb from './db.js'
import path from 'path';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cloudinary from "cloudinary"
import multer from "multer";




//routes
import Eapplication from "./routes/essentialJobsRoute/EApplicationRoute.js"
import EjobsRoute from "./routes/essentialJobsRoute/EjobRoute.js"
import EuserRoute from "./routes/essentialJobsRoute/EuserRoute.js"


const app = express()
dotenv.config();

const __dirname = path.resolve();


// CORS configuration
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174",  "http://localhost:3000",  "http://localhost:3001"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
app.use(cookieParser())
app.use(express.json());
app.use(express.static('public'));

app.use('/uploads',express.static(path.join(__dirname, '/client/dist')));
app.use(morgan('dev'))


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });



  //routes
  app.use('/api/application', Eapplication )
  app.use("/api/job", EjobsRoute)
  app.use("/api/user", EuserRoute)







  // Database connection
const startServer = async () => {
    try {
      await connectDb();
      console.log(`Database connected successfully`);
    } catch (error) {
      console.error(`Database connection failed`, error);
      process.exit(1);
    }
  

  };
  
  startServer();

  const port = process.env.PORT || 5000;
 app.listen(port, () => {
    console.log(`your app is listening on ${port}`)
 })
  
// Catch-all route for client-side routing
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
  