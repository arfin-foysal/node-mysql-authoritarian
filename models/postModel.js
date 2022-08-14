const {Model ,DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

class Post extends Model { }

Post.init({

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  des: {

    type: DataTypes.STRING,
    allowNull: false,

    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    
      },
  
}, {
  sequelize,
  modelName: 'Posts',
    timestamps: true,
});

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User);

module.exports = Post;