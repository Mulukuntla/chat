//const Expense= require("../models/Expense")
const User= require("../models/User")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")



function isstringinvalid(string){
  console.log(string)
  if(string.length==0){
    return true
  }
  else{
    return false
  }
}


function generateAccessToken(id,name){
  return jwt.sign({userId:id,name:name},"hi")
  
}

const signup= async (req,res,next) =>{
  
  try{
    const name=req.body.name;
    const email=req.body.email;
    const phoneNumber=req.body.phoneNumber
    const password=req.body.password;
    console.log(name,email,phoneNumber,password)
    const user=await User.findOne({where:{email}})
    console.log("user------------>",user)
    if(user){
      
      return res.status(400).json({message:"usage already exits",success:"false"})
    }
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
      console.log("Hi")
      return res.status(400).json({err:"Bad parameters - Something is missing"})
    }
    const saltrounds=10
    bcrypt.hash(password,saltrounds,async (err,hash)=>{
      if (err) {
        return res.status(500).json({ success: false, message: "Error hashing password." });
      }
      await User.create({userName:name,email:email,phoneNumber:phoneNumber,password:hash})
      res.status(201).json({message:"Successfully created a new user"})
      
    })
  }  
  catch(err){
    res.status(500).json(err);
  }
}


const signin= async (req,res,next) =>{
  console.log("Hii")
  
  try{
    const email=req.body.email;
    const password=req.body.password;
    console.log(email,password)
    const user=await User.findAll({where:{email}})
    console.log("user------------>",user)
    if(isstringinvalid(email) || isstringinvalid(password)){
      console.log("Hi")
      return res.status(400).json({err:"Bad parameters - Something is missing"})
    }
    console.log(user.length)
    if(user.length>0){
      console.log("password",user[0].password)
      bcrypt.compare(password,user[0].password,(err,result)=>{
        if(err){
          return res.status(500).json({error:err});
        }
        if(result === true){
          return res.status(200).json({success:true,message:"User loggedin Successfully",token:generateAccessToken(user[0].id,user[0].userName)})
        }
        else{
          return res.status(401).json({success:false,message:"Password is incorrect"})
        }

      })
    }
    else{
      return res.status(404).json({success:false,message:"User not found"})
    }
    
  }  
  catch(err){
    res.status(500).json({error:err});
  }
}




    
module.exports={
  signup,
  signin
}