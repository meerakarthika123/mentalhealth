import express from "express";
import {
	getForm, postForm, getSuccess,
	getLogin, postLogin, getDashboard,
	getAdminDashboard, postAddDoctor,
	getDashboard2, getPatient, getAppointment
} from "../controllers/formController.js";
// ✅ Correct import for default export
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
router.post(
  "/add-doctor",
  doctorUpload.fields([
    { name: "profile", maxCount: 1 },
    { name: "academicDocs", maxCount: 5 },
    { name: "licenseCerts", maxCount: 5 },
  ]),
  postAddDoctor
);

// ✅ User dashboard route (already handles session)
router.get("/user-dashboard", (req, res) => {
	if (req.session.user?.role !== "user") return res.redirect("/login");
	res.render("dashboard", { user: req.session.user });
});
router.get("/dashboard2", getDashboard2);
router.get("/patient", getPatient);
router.get("/appointment", getAppointment);


router.get("/doctor/edit/:id", getDoctorEditForm);
router.post("/doctor/edit/:id", doctorUpload.fields([
    { name: "profile", maxCount: 1 },
    { name: "academicDocs", maxCount: 5 },
    { name: "licenseCerts", maxCount: 5 },
  ]), postDoctorEditForm);


export default router;
