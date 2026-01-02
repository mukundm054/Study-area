const express = require("express");
const router = express.Router();

const Interships = require("../model/Internship");

router.post("/", async (req, res) => { 
  const intershipData = new Interships({
   title: req.body.title,
  company: req.body.company,
  location: req.body.location,
  category: req.body.category,
  aboutCompany: req.body.aboutCompany,
  aboutInternship: req.body.aboutInternship,
  whoCanApply: req.body.whoCanApply,
  perks: req.body.perks,
  numberOfOpening: req.body.numberOfOpening,
  stipend: req.body.stipend,
  startDate: req.body.startDate,
  additionalInfo: req.body.additionalInfo,
  });
  await intershipData.save().then((data)=>{
    res.send(data)
  }).catch((error)=>{
    console.log(error)
  })

  
});

router.get("/", async(req,res)=>{ 
  try {
    const data = await Interships.find()
    res.json(data).status(200)
  } catch (error) {
    console.log(error)
    res.status(404).json({error:"Internal Server Error"})
  }
})

router.get("/:id", async(req,res)=>{ 
  const {id}=req.params
  try {
    const data = await Interships.findById(id)
    if(!data){
      res.status(404).json({error:"Intership not found"})
      return
    }
    res.json(data).status(200)
  } catch (error) {
    console.log(error)
    res.status(404).json({error:"Internal Server Error"})
  }
})

module.exports=router
