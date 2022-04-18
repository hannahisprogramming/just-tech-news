const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create user model
class User extends Model {
  //set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

//define table columns and configuration
User.init(
  {
    //table column definitions
    //define id column
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //at least 4 chars long
        len: [4]
      }
    }
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    //table configuration options here (https://sequelize.org/v5/manual/models-definition.html#configuration)

    //pass in imported sequelize connection
    sequelize,
    //dont automatically create createAt/UpdateAt timestamp fields
    timestamps: false,
    //dont pluralize name of db table
    freezeTableName: true,
    //ue underscores instead of camel-casing
    underscored: true,
    //make our model name stays lowercase in db
    modelName:'user'
  }
);

module.exports = User;