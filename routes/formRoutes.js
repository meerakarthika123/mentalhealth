import express from "express";
import {
  getForm,
  postForm,
  getSuccess,
  getLogin,
  postLogin,
  getDashboard,
  getAdminDashboard,
  postAddDoctor,
  getDashboard2,
  getPatient,
  getAppointment,
  getDoctorEditForm,
  postDoctorEditForm,
  postAddPatient
} from "../controllers/formController.js";

import { doctorUpload, patientUpload } from "../middleware/upload.js";

const router = express.Router();

// Redirect root to form
router.get("/", (req, res) => res.redirect("/form"));

// Form routes
router.get("/form", getForm);
router.post("/form", postForm);
router.get("/success", getSuccess);

// Login routes
router.get("/login", getLogin);
router.post("/login", postLogin);

// Dashboard routes
router.get("/dashboard", getDashboard);
router.get("/dashboard2", getDashboard2);
router.get("/appointment", getAppointment);

// Admin dashboard
router.get("/admin-dashboard", getAdminDashboard);
router.get("/adminpatient", getPatient);

// POST: Add patient (with file upload handling)
router.post(
  "/add-patient",
  patientUpload.fields([
    { name: "profile", maxCount: 1 },
    { name: "reports", maxCount: 5 }
  ]),
  postAddPatient
);

// POST: Add doctor (with file upload handling)
router.post(
  "/add-doctor",
  doctorUpload.fields([
    { name: "profile", maxCount: 1 },
    { name: "academicDocs", maxCount: 5 },
    { name: "licenseCerts", maxCount: 5 },
  ]),
  postAddDoctor
);

// Edit doctor
router.get("/doctor/edit/:id", getDoctorEditForm);
router.post(
  "/doctor/edit/:id",
  doctorUpload.fields([
    { name: "profile", maxCount: 1 },
    { name: "academicDocs", maxCount: 5 },
    { name: "licenseCerts", maxCount: 5 },
  ]),
  postDoctorEditForm
);

// User dashboard
router.get("/user-dashboard", (req, res) => {
  if (req.session.user?.role !== "user") return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
});

export default router;
import { getPatientEditForm, postPatientEditForm } from "../controllers/formController.js";

router.get("/patient/edit/:id", getPatientEditForm);
router.post("/patient/edit/:id", patientUpload.fields([
  { name: "profile", maxCount: 1 },
  { name: "reports", maxCount: 5 }
]), postPatientEditForm);
