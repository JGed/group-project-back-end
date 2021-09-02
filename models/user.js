const Recipe = require("../db").import("./recipe");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordhash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photoURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  User.hasMany(Recipe);

  return User;
};
