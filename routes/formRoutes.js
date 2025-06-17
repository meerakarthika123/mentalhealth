import express from "express";
import {
	getForm, postForm, getSuccess,
	getLogin, postLogin, getDashboard
} from "../controllers/formController.js";

const router = express.Router();

router.get("/", (req, res) => res.redirect("/form"));

router.get("/form", getForm);
router.post("/form", postForm);
router.get("/success", getSuccess);

// Login routes
router.get("/login", getLogin);
router.post("/login", postLogin);

// Dashboard route
router.get("/dashboard", getDashboard);

export default router;


