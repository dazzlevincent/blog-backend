const express =require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcryptjs = require("bcryptjs")
const { blogmodel } = require("./models/blog.js")


const app =express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://dazzlevincent:dazzlevincent2002@cluster0.61vaosq.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")
const generateHashedPassword= async(password)=>{
    const Salt=await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,Salt)

}

app.post("/signUp",async(req,res)=>{


    let input=req.body
    let hashedPassword= await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let blog = new blogmodel(input)
    blog.save()
    

    res.json({"status":"success"})
})
app.post("/signIn",async(req,res)=>{

    let input = req.body
    blogmodel.find({"email":req.body.email}).then
    (
       (response)=>{
       if (response.length > 0) {
        let dbPassword = response[0].password
        console.log(dbPassword)
        bcryptjs.compare(input.password,dbPassword,(error,isMatch)=>{
            if(isMatch){
                res.json({"status":"success","userId":response[0]._id})
            }else{
                res.json({"status":"incorrect"})
            }
        })
        
        
       } else {
        
        res.json({"status":"user not found"})
       }
        console.log(response)
       } 
    )

})

app.listen(8080,()=>{
    console.log("Server started")
})
