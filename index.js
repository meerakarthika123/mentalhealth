import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import formRoute from "./routes/formRoutes.js";



const app = express();
const PORT = 3000;
app.use(express.static('public'));


// ⚠️ Direct MongoDB connection string (NO .env)
const mongoURI = "mongodb+srv://mumthas:mumthas123@mumthas.gpioijt.mongodb.net/?retryWrites=true&w=majority&appName=mumthas";

// Replace <username> and <password> with your MongoDB Atlas credentials
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Error:", err));

// Session setup
app.use(session({
	secret: "kebin",
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));

// Body parser
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");

// Use Routes
app.use("/", formRoute);

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
import multer from "multer";
const upload = multer({ dest: "uploads/" });

router.get("/doctor/edit/:id", getDoctorEditForm);
router.post("/doctor/edit/:id", upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "academicDocs", maxCount: 5 },
    { name: "licenseCerts", maxCount: 5 }
]), postDoctorEdit);

