const messagesTable=require("../models/messages")
const archievedChatTable=require("../models/archievedChat")
const { Op } = require("sequelize"); 

const archieveMessages=async ()=>{
    try{
        console.log("Hi")
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
        const messages=await messagesTable.findAll({
            where:{createdAt: { [Op.lte]: oneDayAgo},}
        })
        console.log(messages)
        const archivedData = messages.map((msg) => ({
            userName:msg.userName,
            userId: msg.userId,
            groupId: msg.groupId,
            message: msg.message,
            fileUrl: msg.fileUrl,
            createdAt: msg.createdAt,
        }));
        console.log(archivedData)
        await archievedChatTable.bulkCreate(archivedData)
        console.log("Hi")
        const messageId = messages.map((msg) => msg.id);
        console.log(messageId)
        await messagesTable.destroy({
            where: {
            id: messageId,
            },
        });

    }
    catch(err){
        console.log(err)
    }

}

module.exports={
    archieveMessages,
}