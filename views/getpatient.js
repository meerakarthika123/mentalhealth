import Patient from "../models/patient.js";  // Make sure this import exists

export const getPatient = async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login");
  }

  try {
    const patients = await Patient.find(); // fetch all patients
    res.render("adminpatient", { user: req.session.user, patients }); // pass patients here
  } catch (err) {
    res.send("Error fetching patients: " + err.message);
  }
};
