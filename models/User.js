const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const Expense=sequelize.define("user",{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  userName: Sequelize.STRING,
  email:{
    type:Sequelize.STRING,
    unique:true
    
  },
  phoneNumber: Sequelize.INTEGER,
  password:{
    type:Sequelize.STRING,
   
  },
  
});

module.exports = Expense;
