const {Model ,DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require("bcrypt");
const Post = require('./postModel');


class User extends Model { }

User.init({
  id: {
          type: DataTypes.INTEGER,
            primaryKey: true,
             autoIncrement: true,
            allowNull:false
         },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {

    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  avater: {
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
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
});

// User.hasMany(Post, { foreignKey: 'userId' });
// Post.belongsTo(User);


module.exports = User;


    
