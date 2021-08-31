module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define("recipe", {
    category: {
      type: DataTypes.STRING,
      allNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allNull: false,
    },

    directions: {
      type: DataTypes.STRING,
      allNull: false,
    },
    cookTime: {
      type: DataTypes.NUMBER,
      allNull: false,
    },
    servings: {
      type: DataTypes.NUMBER,
    },
    public: {
      type: DataTypes.BOOLEAN,
    },
    photoURL: {
      type: DataTypes.STRING,
    },
  });
  return recipe;
};
