

const express = require('express');


const router = express.Router();
const userauthenticate=require("../Middleware/auth")
const userController=require("../Controllers/messages")
const multer = require('multer');

const upload = multer()



router.post("/sendMessage/:groupId",userauthenticate.authenticate,upload.single("file"),userController.sendMessage);

router.post("/sendsMessage",userauthenticate.authenticate,userController.sendsMessage);
router.get("/allMessages/:groupId",userauthenticate.authenticate,userController.allMessages);


module.exports = router;