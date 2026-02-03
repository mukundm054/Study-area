const express = require("express")
const router = express.Router()
const Resume = require("../model/Resume")


router.post("/",async (req,res) => {
    try {
        const {userId}= req.body

        if(!userId){
            return res.status(400).json({error:"User id is required"})
        }

        let resume = await Resume.findOne({ userId })

        if(resume){
            resume=await Resume.findOneAndUpdate(
                {userId},
                {...req.body,upDateAt: new Date()},
                {new:true}
            )
            return res.status(200).json({message:"Resume updated successful",resume})
        }

        const newResume = new Resume(req.body)
        await newResume.save()

        res.status(201).json({message:"Resume created sucessfull",resume:newResume})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Failed to save resume"})
    }
})


router.get("/:userId",async (req,res) => {
    try {
        const resume = await Resume.findOne({userId:req.params.userId})

        if(!resume){
           return res.status(404).json({error:"Resume not found"})
        }

        res.status(200).json(resume)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"failed to fetch data "})
    }
})

module.exports=router