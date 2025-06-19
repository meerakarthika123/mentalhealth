import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import formRoute from "./routes/formRoutes.js";



const app = express();
const PORT = 3000;
app.use(express.static('public'));


// ⚠️ Direct MongoDB connection string (NO .env)
const mongoURI = "mongodb+srv://meerainmca2126:root@meera46.t1gf1ia.mongodb.net/?retryWrites=true&w=majority&appName=meera46";

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
