const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const Expense=sequelize.define("message",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userName:Sequelize.STRING,
    message: Sequelize.STRING,
    fileUrl:Sequelize.STRING,
  
  
});

module.exports = Expense;
