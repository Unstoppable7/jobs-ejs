const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
   company: {
      type: String,
      required: [true, "Please provide a company name"]
   },
   position: {
      type: String,
      required: [true, "Please provide a position"]
   },
   status: {
      type: String,
      required: [true,"Pleae provide a status"]
   },
   createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
   },
});

module.exports = mongoose.model("Job", jobSchema);
