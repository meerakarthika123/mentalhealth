import express from "express";
import {
	getForm, postForm, getSuccess,
	getLogin, postLogin, getDashboard,
	getAdminDashboard, postAddDoctor,
	getDashboard2, getPatient, getAppointment
} from "../controllers/formController.js";
import { doctorUpload } from "../middleware/upload.js";
import {
  getDoctorEditForm,
  postDoctorEditForm
} from "../controllers/formController.js";

const router = express.Router();

router.get("/", (req, res) => res.redirect("/form"));
router.get("/form", getForm);
router.post("/form", postForm);
router.get("/success", getSuccess);
router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/dashboard", getDashboard);

// ✅ Use controller that fetches doctors
router.get("/admin-dashboard", getAdminDashboard);
router.post("/add-doctor", postAddDoctor);

// ✅ User dashboard route (already handles session)
router.get("/user-dashboard", (req, res) => {
	if (req.session.user?.role !== "user") return res.redirect("/login");
	res.render("dashboard", { user: req.session.user });
});
router.get("/dashboard2", getDashboard2);
router.get("/patient", getPatient);
router.get("/appointment", getAppointment);


router.get("/doctor/edit/:id", getDoctorEditForm);
router.post("/doctor/edit/:id", doctorUpload, postDoctorEditForm);


export default router;
