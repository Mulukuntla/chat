const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const Expense=sequelize.define("group",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupName:Sequelize.STRING,
    inviteLink:Sequelize.STRING,
  
});

module.exports = Expense;
