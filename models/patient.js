import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dob: String,
  gender: String,
  history: String,
  profile: String,     // file name of profile picture
  reports: [String]    // array of file names for reports
});

export default mongoose.models.Patient || mongoose.model("Patient", patientSchema);
