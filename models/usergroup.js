const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const Expense=sequelize.define("usergroup",{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  userName: Sequelize.STRING,
  phoneNumber: Sequelize.INTEGER,
  
  
});

module.exports = Expense;
