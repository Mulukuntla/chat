

const express = require('express');


const router = express.Router();
const userauthenticate=require("../Middleware/auth")
const userController=require("../Controllers/group")



router.post("/addgroup",userauthenticate.authenticate,userController.addGroup);

router.get("/allgroups",userauthenticate.authenticate,userController.allgroups);
router.get("/allgroups/invite/:addMembers",userauthenticate.authenticate,userController.addMembers);



module.exports = router;