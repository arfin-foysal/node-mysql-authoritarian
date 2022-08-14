const {  DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require("bcrypt");

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
    },
    
    password: {
        type: DataTypes.STRING,
        set(value) {
            const hash = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hash);
          },
    },
    verified: {
        type: DataTypes.STRING,
        defaultValue:false
    },
    createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    
})

module.exports = User;


    
