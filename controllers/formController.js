import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/patient.js";  // <-- Import Patient model

const ADMIN_CREDENTIALS = {
  email: "admin@123",
  password: "admin123"
};

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

// Render login page
export const getLogin = (req, res) => {
  res.render("login", { error: null });
};

// Handle login logic
export const postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    req.session.user = { email, role: "admin" };
    return res.redirect("/dashboard2");
  }

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

// User dashboard
export const getDashboard = (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
};

export const getSuccess = (req, res) => {
  res.render("success", { user: req.session.user });
};

// Admin dashboard - doctors
export const getAdminDashboard = async (req, res) => {
  if (req.session.user?.role !== "admin") return res.redirect("/login");
  try {
    const doctors = await Doctor.find();
    res.render("admindashboard", { user: req.session.user, doctors });
  } catch (err) {
    res.send("Error fetching doctors: " + err.message);
  }
};

// Add a new doctor
export const postAddDoctor = async (req, res) => {
  const { firstName, lastName, experience, expertise, address, description, dob } = req.body;

  const profile = req.files["profile"]?.[0]?.filename || "";
  const academicDocs = req.files["academicDocs"]?.map(f => f.filename) || [];
  const licenseCerts = req.files["licenseCerts"]?.map(f => f.filename) || [];

  await Doctor.create({
    firstName,
    lastName,
    experience,
    expertise,
    address,
    description,
    dob,
    profile,
    academicDocs,
    licenseCerts,
  });

  res.redirect("/admin-dashboard");
};

// Admin dashboard main page
export const getDashboard2 = (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login");
  }
  res.render("dashboard2", { user: req.session.user });
};

// **Patient dashboard - fetch and show patients**
export const getPatient = async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login");
  }

  try {
    const patients = await Patient.find();
    res.render("adminpatient", { user: req.session.user, patients });
  } catch (err) {
    res.send("Error fetching patients: " + err.message);
  }
};

// Appointment page
export const getAppointment = (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login");
  }
  res.render("appointment", { user: req.session.user });
};

// Doctor edit form
export const getDoctorEditForm = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  res.render("doctor", { doctor });
};

// Handle doctor edit form submission
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
export const getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.render("doctorDetails", { doctor });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching doctor details");
  }
};


export const postAddPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dob } = req.body;

    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      phone,
      dob,
    });

    await newPatient.save();

    res.redirect('/adminpatient');  // redirect to patient list or appropriate page
  } catch (err) {
    res.status(500).send('Error adding patient: ' + err.message);
  }
};
// Example skeleton for getPatientEditForm and postPatientEditForm

// Show patient edit form by ID
export const getPatientEditForm = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);  // Assuming you have a Patient model
    if (!patient) return res.status(404).send("Patient not found");

    res.render("patientEditForm", { patient });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Handle patient edit form submission
export const postPatientEditForm = async (req, res) => {
  try {
    const patientId = req.params.id;
    const updateData = req.body;

    // If files uploaded, attach file paths to updateData here

    await Patient.findByIdAndUpdate(patientId, updateData);

    res.redirect("/adminpatient"); // or wherever you want after update
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
