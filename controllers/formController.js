import { body, validationResult } from "express-validator";
import User from "../models/User.js";

export const getForm = (req, res) => {
	res.render("form");
};

export const postForm = [
	body("first_name").notEmpty().withMessage("First name is required!").trim().escape(),
	body("last_name").notEmpty().withMessage("Last name is required!").trim().escape(),
	body("email").notEmpty().withMessage("Email is required!").isEmail().normalizeEmail(),
	body("password").notEmpty().withMessage("Password is required!").isLength({ min: 4 }),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("form", { errors: errors.array() });
		}

		const { first_name, last_name, email, password } = req.body;

		try {
			const newUser = new User({
				firstName: first_name,
				lastName: last_name,
				email,
				password
			});
			await newUser.save();

			req.session.user = newUser;
			res.redirect("/success");
		} catch (err) {
			res.send("❌ Error saving to DB: " + err.message);
		}
	}
];

// ✅ Render login page
export const getLogin = (req, res) => {
	res.render("login", { error: null });
};

// ✅ Handle login logic
export const postLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email, password }); // Note: no hashing yet

		if (!user) {
			return res.render("login", { error: "Invalid email or password!" });
		}

		req.session.user = user;
		res.redirect("/dashboard");
	} catch (err) {
		res.send(" Login Error: " + err.message);
	}
};

// ✅ Dashboard
export const getDashboard = (req, res) => {
	if (!req.session.user) return res.redirect("/login");
	res.render("dashboard", { user: req.session.user });
};
export const getSuccess = (req, res) => {
	res.render("success", { user: req.session.user });
};
