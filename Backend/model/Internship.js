const { Type } = require("lucide-react");
const mongoose = require("mongoose");
const Intershipschema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  category: String,
  aboutCompany: String,
  aboutInternship: String,
  whoCanApply: String,
  perks: Array,
  numberOfOpening: String,
  stipend: String,
  startDate: String,
  additionalInfo: String,
  creatAT: {
    type: Date,
    default: Date.now,
  },
});

module.exports=mongoose.model('Interships',Intershipschema)
