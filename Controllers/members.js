const user= require("../models/User")
const group= require("../models/group")
const usergroup= require("../models/usergroup")
const admingroup= require("../models/admin")
const crypto = require("crypto");


const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const members= async (req,res,next) =>{
    
    try{
        const groupId=req.params.groupId
        console.log(groupId)
        const userAdmin=await admingroup.findAll({where:{userId:req.user.id,groupId:groupId}})
        const admin=await admingroup.findAll({where:{groupId:groupId}})
        const usergroups=await usergroup.findAll({where:{groupId:groupId}})
        console.log(admin.length)
        console.log(userAdmin.length)
        if(userAdmin.length==0){
          res.status(200).json({admin:admin,usergroup:usergroups,userAdmin:false})

        }
        else{
          res.status(200).json({admin:admin,usergroup:usergroups,userAdmin:true})

        }

        
    }
    catch(err){
     console.log(err)
     res.status(500).json({err:err})

    }
  }




  const addAdminMember= async (req,res,next) =>{
    
    try{
        const userName=req.body.userName
        const phoneNumber=req.body.phoneNumber
        const userId=req.body.userId
        const groupId=req.body.groupId
        console.log(userName,phoneNumber,userId,groupId)
        const makingAdmin=await admingroup.findAll({where:{userId:req.user.id,groupId:groupId}})
        if(makingAdmin.length ==0){
            return res.status(200).json({message:"you are not an admin user"})
        }
        const admin=await admingroup.findAll({where:{userId:userId,groupId:groupId}})
        if(admin.length>0){
            //const c=await admingroup.create({userName:userName,phoneNumber:phoneNumber,userId:userId,groupId:groupId})
            res.status(200).json({message:"already a admin user"})

        }
        else{
            const c=await admingroup.create({userName:userName,phoneNumber:phoneNumber,userId:userId,groupId:groupId})
            res.status(200).json({message:"this user is an admin now"})
        }
        
        
        
    }
    catch(err){
     console.log(err)
     res.status(500).json({err:err})

    }
  }
  
  
  





  
 
  const removeAsAdmin= async (req,res,next) =>{
    try{
        const userName=req.body.userName
        const phoneNumber=req.body.phoneNumber
        const userId=req.body.userId
        const groupId=req.body.groupId
        console.log(userName,phoneNumber,userId,groupId)
        const makingAdmin=await admingroup.findAll({where:{userId:req.user.id,groupId:groupId}})
        if(makingAdmin.length ==0){
            return res.status(200).json({message:"you are not an admin user"})
        }
        const admin=await admingroup.findAll({where:{userId:userId,groupId:groupId}})
        if(admin.length>0){
            const c=await admingroup.destroy({where:{userId:userId,groupId:groupId}})
            res.status(200).json({message:"not an admin now"})

        }
        else{
           
            res.status(200).json({message:"He is already not an admin"})
        }
    }
    catch(err){
     console.log(err)
     res.status(500).json({err:err})

    }
  }
  
  const searchMembersToGroup= async (req,res,next) =>{
    
    try{
        const input=req.body.input
        const groupId=req.body.groupId
        const users = await user.findAll({
            where: {
              [Op.and]: [
                // Match the input against userName, email, or phoneNumber
                {
                  [Op.or]: [
                    { userName: { [Op.like]: `${input}%` } },
                    { email: { [Op.like]: `${input}%` } },
                    { phoneNumber: { [Op.like]: `${input}%` } },
                  ],
                },
                // Exclude users who are part of the specified group
                {
                  id: {
                    [Op.notIn]: Sequelize.literal(
                      `(SELECT userId FROM usergroups WHERE groupId = ${groupId})`
                    ),
                  },
                },
              ],
            },
          });
        res.status(200).json({users:users})
    }
    catch(err){
     console.log(err)
     res.status(500).json({err:err})

    }
  }

  
  
  
  
  const addMembersToGroup= async (req,res,next) =>{
    
    try{
        const userName=req.body.userName
        const phoneNumber=req.body.phoneNumber
        const userId=req.body.userId
        const groupId=req.body.groupId
        console.log(userName,phoneNumber,userId,groupId)
        const usergroups=await usergroup.findAll({where:{userId:userId,groupId:groupId}})
        if(usergroups.length==0){
            const usergroupss=await usergroup.create({userName:userName,phoneNumber:phoneNumber,userId:userId,groupId:groupId})
            return res.status(200).json({user:usergroupss,message:"user added to the group"})

        }
        if(usergroups.length>0){
            return res.status(200).json({message:"already a user to that group"})
        }

        
    }
    catch(err){
     console.log(err)
     res.status(500).json({err:err})

    }
  }





  const removeMembersToGroup= async (req,res,next) =>{
    
    try{
        const userName=req.body.userName
        const phoneNumber=req.body.phoneNumber
        const userId=req.body.userId
        const groupId=req.body.groupId
        console.log(userName,phoneNumber,userId,groupId)
        const makingAdmin=await admingroup.findAll({where:{userId:req.user.id,groupId:groupId}})
        if(makingAdmin.length ==0){
            return res.status(200).json({message:"you are not an admin user"})
        }
        const usergroups=await usergroup.findAll({where:{userId:userId,groupId:groupId}})
        if(usergroups.length==0){
            //const usergroupss=await usergroup.create({userName:userName,phoneNumber:phoneNumber,userId:userId,groupId:groupId})
            return res.status(200).json({message:"user already not there in the group"})

        }
        if(usergroups.length>0){
            const user=await usergroup.destroy({where:{userId:userId,groupId:groupId}})
            res.status(200).json({user:user,message:"not a member"})
        }

        
    }
    catch(err){
     console.log(err)
     res.status(500).json({err:err})

    }
  }
  
  
  
      
  module.exports={
    members,
    addAdminMember,
    removeAsAdmin,
    searchMembersToGroup,
    addMembersToGroup,
    removeMembersToGroup,
   
  }
  
  
 