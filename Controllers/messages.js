const message= require("../models/messages")
const admin= require("../models/admin")

const AWS=require("aws-sdk")
const multer = require("multer");

const multerS3 = require("multer-s3");
const S3service=require("../services/S3services")

const upload = multer({
  storage: multerS3({
    s3: S3service,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read", // Make uploaded file publicly readable
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});



const sendMessage= async (req,res,next) =>{
    console.log("Hii")
    try{
      const id=req.user.id
      const name=req.body.name  
      const messagee=req.body.message
      const groupId=req.params.groupId
      console.log(id,name,message,groupId)
      const file = req.file
      console.log(file)
      let fileUrl;

    // Upload the file to S3 if it's provided
      if (file!==undefined) {
        fileUrl = await S3service.uploadToS3(file.buffer, `${Date.now()}-${file.originalname}`);
      }
      console.log(fileUrl)
      
      const sendMessage=await message.create({userName:name,message:messagee,fileUrl:fileUrl,userId:req.user.id,groupId:groupId})
      res.status(200).json({message:sendMessage})
    }
    catch(err){
      console.log(err)
      res.status(500).json({error:err});
    }
  }


  const allMessages= async (req,res,next) =>{
    console.log("Hii")
    try{
      console.log(req.params.groupId)
      const userAdmin=await admin.findAll({where:{userId:req.user.id,groupId:req.params.groupId}})
      const allMessages=await message.findAll({where:{groupId:req.params.groupId}})
      console.log(allMessages)
      if(userAdmin.length>0){
        res.status(200).json({allMessages:allMessages,userAdmin:true})

      }
      else{
        res.status(200).json({allMessages:allMessages,userAdmin:false})

      }
    }
    catch(err){
      console.log(err)
      res.status(500).json({error:err});
    }
  }
  const sendsMessage= async (req,res,next) =>{
    console.log("Hi")
    console.log(req.body.message)
    const message=req.body.message
    const file = req.file
    console.log(file)
    let fileUrl;

    // Upload the file to S3 if it's provided
    if (file) {
      fileUrl = await S3service.uploadToS3(file.buffer, `${Date.now()}-${file.originalname}`);
    }
    console.log(fileUrl)
    res.status(200).json({message:message,fileUrl:fileUrl})


    
  }
  
  
  
  
      
  module.exports={
    sendMessage,
    allMessages,
    sendsMessage
  }
  
  
 