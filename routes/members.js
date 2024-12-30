

const express = require('express');


const router = express.Router();
const userauthenticate=require("../Middleware/auth")
const userController=require("../Controllers/members")





router.get("/allMembers/:groupId",userauthenticate.authenticate,userController.members);
router.post("/addAdmin",userauthenticate.authenticate,userController.addAdminMember);
router.post("/removeAsAdmin",userauthenticate.authenticate,userController.removeAsAdmin);
router.post("/searchMembersToGroup",userauthenticate.authenticate,userController.searchMembersToGroup);
router.post("/addMembersToGroup",userauthenticate.authenticate,userController.addMembersToGroup);
router.post("/removeMembersToGroup",userauthenticate.authenticate,userController.removeMembersToGroup);




module.exports = router;