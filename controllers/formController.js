import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

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

    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        req.session.user = { email, role: "admin" };
        return res.redirect("/dashboard2");
    }

    // ✅ Regular user check from DB
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.render("login", { error: "Invalid credentials!" });
        }
        req.session.user = { ...user.toObject(), role: "user" };
        res.redirect("/user-dashboard");
    } catch (err) {
        res.send("❌ Login error: " + err.message);
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
const ADMIN_CREDENTIALS = {
    email: "admin@123",
    password: "admin123"
};
export const getAdminDashboard = async (req, res) => {
	if (req.session.user?.role !== "admin") return res.redirect("/login");
	try {
		const doctors = await Doctor.find();
		res.render("admindashboard", { user: req.session.user, doctors }); // ✅ doctors passed here
	} catch (err) {
		res.send("Error fetching doctors: " + err.message);
	}
};

export const postAddDoctor = async (req, res) => {
  await Doctor.create(req.body);
  res.redirect("/admin-dashboard");
};
export const getDashboard2 = (req, res) => {
	if (!req.session.user || req.session.user.role !== "admin") {
		return res.redirect("/login");
	}
	res.render("dashboard2", { user: req.session.user });
};

export const getPatient = (req, res) => {
	if (!req.session.user || req.session.user.role !== "admin") {
		return res.redirect("/login");
	}
	res.render("patient", { user: req.session.user });
};

export const getAppointment = (req, res) => {
	if (!req.session.user || req.session.user.role !== "admin") {
		return res.redirect("/login");
	}
	res.render("appointment", { user: req.session.user });
};


export const postDoctorEditForm = async (req, res) => {
  try {
    const { firstName, lastName, experience, expertise, address, description, dob } = req.body;
    const updateData = {
      firstName,
      lastName,
      experience,
      expertise,
      address,
      description,
      dob
    };

    if (req.files["profile"]) {
      updateData.profile = "/uploads/" + req.files["profile"][0].filename;
    }

    if (req.files["academicDocs"]) {
      updateData.academicDocs = req.files["academicDocs"].map(f => "/uploads/" + f.filename);
    }

    if (req.files["licenseCerts"]) {
      updateData.licenseCerts = req.files["licenseCerts"].map(f => "/uploads/" + f.filename);
    }

    await Doctor.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin-dashboard");
  } catch (err) {
    res.send("❌ Error updating doctor: " + err.message);
  }
};
export const getDoctorEditForm = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).send("Doctor not found.");
  res.render("doctor", { doctor });
};

export const postDoctorEdit = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).send("Doctor not found.");

    const { firstName, lastName, experience, expertise, address, description, dob } = req.body;

    doctor.firstName = firstName;
    doctor.lastName = lastName;
    doctor.experience = experience;
    doctor.expertise = expertise;
    doctor.address = address;
    doctor.description = description;
    doctor.dob = dob;

    // Handle file uploads
    if (req.files?.profile?.[0]) {
      doctor.profile = req.files.profile[0].filename;
    }

    if (req.files?.academicDocs) {
      doctor.academicDocs = req.files.academicDocs.map(f => f.filename);
    }

    if (req.files?.licenseCerts) {
      doctor.licenseCerts = req.files.licenseCerts.map(f => f.filename);
    }

    await doctor.save();
    res.redirect("/admin-dashboard");
  } catch (err) {
    res.send("Error updating doctor: " + err.message);
  }
};


