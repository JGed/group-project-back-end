const router = require("express").Router();
const Recipe = require("../db").import("../models/recipe");
const validateSession = require("../middleware/validate-session");
// create a new recipe
router.post("/", validateSession, async (req, res) => {
  const user = req.user;
  const { name, category, directions, cookTime, servings, photoURL, isPublic } =
    req.body.recipe;
  try {
    const newRecipe = await Recipe.create({
      name: name,
      category: category,
      directions: directions,
      cookTime: cookTime,
      servings: servings,
      photoURL: photoURL,
      isPublic: isPublic,
      userId: user.id,
    });
    res.status(200).json({
      message: "Recipe successfully created!",
      recipe: newRecipe,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to create recipe.",
      error: error,
    });
  }
});
// get all recipes for a user
router.get("/mine", validateSession, (req, res) => {
  const user = req.user.id;
  Recipe.findAll({ where: { userId: user } })
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) =>
      res.status(500).json({ error: err, message: "Error: No recipes found" })
    );
});

// get all publicly available recipes
router.get("/", (req, res) => {
  Recipe.findAll({
    where: { isPublic: true },
  })
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) =>
      res.status(500).json({
        error: err,
        message: "Error: No recipes found",
      })
    );
});

// update the recipe matching the request parameter
router.put("/update/:entryId", validateSession, (req, res) => {
  let entryId = req.params.entryId;
  const updateRecipe = {
    name: req.body.recipe.name,
    category: req.body.recipe.category,
    directions: req.body.recipe.directions,
    cookTime: req.body.recipe.cookTime,
    servings: req.body.recipe.servings,
    isPublic: req.body.recipe.isPublic,
    photoURL: req.body.recipe.photoURL,
  };
  const query = { where: { id: entryId, userId: req.user.id } };
  console.log(query);
  Recipe.update(updateRecipe, query)
    .then((recipes) =>
      res.status(200).json({ recipes, message: "Recipe successfully updated" })
    )
    .catch((err) =>
      res.status(500).json({ error: err, message: "Error: Recipe not updated" })
    );
});

//delete the recipe
router.delete("/delete/:recipeId", validateSession, (req, res) => {
  let recipeId = req.params.recipeId;

  const query = { where: { id: recipeId, userId: req.user.id } };

  Recipe.destroy(query)
    .then(() => res.status(200).json({ message: "Recipe Deleted" }))
    .catch((err) =>
      res.status(500).json({ error: err, message: "Error: Recipe not deleted" })
    );
});

module.exports = router;
