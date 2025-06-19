// models/Patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: String,
  pno: String,
  dob: Date,
  gender: String,
  profile: String,
  history: String,
  reports: [String],
});

export default mongoose.model("Patient", patientSchema);
