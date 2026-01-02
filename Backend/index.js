const bodyparser = require("body-parser")
const express = require("express")
const app = express()
const cors = require("cors")
const {connect} = require("./db")
const router = require("./Routes/index")
const port = 5000

app.use((cors()))
app.use(bodyparser.json({limit:"50mb"}))
app.use(bodyparser.urlencoded({extended:true,limit:"50mb"}))
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello this is studyArea backend")
})
app.use("/api",router)
connect();
app.use((req,res,next)=>{
    req.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.listen(port,()=>{
    console.log(`server is running ${port}`)
})