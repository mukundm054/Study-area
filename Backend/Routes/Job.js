const express = require("express");
const router = express.Router();

const Job = require("../model/Job");

router.post("/", async (req, res) => {
  const jobData = new Job({
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    Experience: req.body.Experience,
    category: req.body.category,
    aboutCompany: req.body.aboutCompany,
    aboutJob: req.body.aboutJob,
    whoCanApply: req.body.whoCanApply,
    perks: req.body.perks,
    additionalInfo: req.body.additionalInfo,
    CTC: req.body.CTC,
    startDate: req.body.startDate,
  });
  await jobData.save().then((data)=>{
    res.send(data)
  }).catch((error)=>{
    console.log(error)
  })

  
});

router.get("/", async(req,res)=>{ 
  try {
    const data = await Job.find()
    res.json(data).status(200)
  } catch (error) {
    console.log(error)
    res.status(404).json({error:"Internal Server Error"})
  }
})

router.get("/:id", async(req,res)=>{ 
  const {id}=req.params
  try {
    const data = await Job.findById(id)
    if(!data){
      res.status(404).json({error:"Job not found"})
    }
    res.json(data).status(200)
  } catch (error) {
    console.log(error)
    res.status(404).json({error:"Internal Server Error"})
  }
})

module.exports=router
