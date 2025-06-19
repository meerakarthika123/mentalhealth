import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  experience: String,
  expertise: String,
  address: String,
  description: String,
  dob: Date,
  profile: String,
  academicDocs: [String],
  licenseCerts: [String]
});

export default mongoose.model("Doctor", doctorSchema);
