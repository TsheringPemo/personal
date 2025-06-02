const express=require("express"); 
const cors=require("cors"); 
require("dotenv").config(); 
const app=express(); 
app.use(cors()); 
app.use(express.json()); 
app.get("/",(req,res)=>{ 
    res.send("E-commerceAPIisrunning..."); 
}); 
constPORT=process.env.PORT||5000; 
app.listen(PORT,()=>console.log(`Serverrunningonport${PORT}`));