module.exports = (sequelize, DataTypes) => {
    const Recipe = sequelize.define('recipe', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        directions: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cookTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        servings: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        photoURL: {
            type: DataTypes.STRING,
            allowNull: true
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })
    return Recipe;
}