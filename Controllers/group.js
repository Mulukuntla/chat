const user= require("../models/User")
const group= require("../models/group")
const usergroup= require("../models/usergroup")
const admingroup= require("../models/admin")
const crypto = require("crypto");
const addGroup= async (req,res,next) =>{
    
    try{
        const groupName=req.body.group
        const inviteCode = crypto.randomBytes(8).toString("hex");
        const addgroup=await group.create({groupName:groupName,inviteLink:inviteCode})
        const a=await group.findOne({where:{groupName:groupName}})
        const users=await user.findOne({where:{id:req.user.id}})
        console.log(a.id)
        const b=await usergroup.create({userName:users.userName,phoneNumber:users.phoneNumber,userId:req.user.id,groupId:a.id})
        const c=await admingroup.create({userName:users.userName,phoneNumber:users.phoneNumber,userId:req.user.id,groupId:a.id})
       
        res.status(201).json({groupId:a.id,groupName:groupName,inviteLink:inviteCode})
    }
    catch(err){
     console.log(err)
    }
  }
  const allgroups= async (req,res,next) =>{
    
    try{
        console.log("user-------->",req.user.id)
        const userGroups = await usergroup.findAll({
            where: { userId: req.user.id }, // Filter by the userId
            include: {
              model: group, // Join with the groupTable
              attributes: ['id', 'groupName','inviteLink'], // Fetch only id and groupName from groupTable
            },
            attributes: [], // Exclude attributes from the usergroup table if not needed
        });
        res.status(200).json({groups:userGroups})

    }
    catch(err){
     console.log(err)
    }
  }
const addMembers= async (req,res,next) =>{
  console.log("Hii");

  try {
    const addMembers = req.params.addMembers;

    
    const groupData = await group.findOne({ where: { inviteLink: addMembers } });

    if (!groupData) {
        return res.status(404).json({ user:1,messagess: "Group not found." });
    }

    const groupId = groupData.id;

    
    const existingUser = await usergroup.findOne({ where: { userId: req.user.id, groupId } });
    console.log(existingUser)
    if (existingUser ==null) {
        
        await usergroup.create({ userId: req.user.id, groupId });
        return res.status(200).json({user:2,messagess: "User added to the group." });
    } else {
        
        return res.status(200).json({user:3,messagess: "User is already a member of the group." });
    }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ messagess: "An error occurred while adding the user." });
  }
}


  
  
  
  
      
  module.exports={
    addGroup,
    allgroups,
    addMembers,
  }
  
  
 