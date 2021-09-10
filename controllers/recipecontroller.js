const router = require('express').Router();
const Recipe = require('../db').import('../models/recipe');
const optionalValidateSession = require('../middleware/optional-validate-session');
const validateSession = require('../middleware/validate-session');
// create a new recipe
router.post('/', validateSession, async (req, res) => {
    const user = req.user;
    const {
        name,
        category,
        directions,
        cookTime,
        servings,
        photoURL,
        isPublic,
    } = req.body.recipe;
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
            message: 'Recipe successfully created!',
            recipe: newRecipe,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to create recipe.',
            error: error,
        });
    }
});
// get all recipes for a user
router.get('/mine', validateSession, (req, res) => {
    const user = req.user.id;
    Recipe.findAll({ where: { userId: user } })
        .then((recipes) => res.status(200).json(recipes))
        .catch((err) =>
            res
                .status(500)
                .json({ error: err, message: 'Error: No recipes found' })
        );
});

// get all publicly available recipes
router.get('/', (req, res) => {
    Recipe.findAll({
        where: { isPublic: true },
    })
        .then((recipes) => res.status(200).json(recipes))
        .catch((err) =>
            res.status(500).json({
                error: err,
                message: 'Error: No recipes found',
            })
        );
});

// get recipe by id, if known user requests recipe that is not their own, recipe views will be incremented
router.get('/:recipeId', optionalValidateSession, async (req, res) => {
    const user = req.user;
    const recipeId = req.params.recipeId;
    let recipe = await Recipe.findByPk(recipeId);
    if(recipe !== null) {
      // if a token was sent with the request and the associated user is not the creator of the recipe
      // the views of the recipe will increase
      if(user?.id !== recipe.userId) {
          if(recipe.isPublic) {
              if(user !== undefined) {
                recipe = await recipe.increment('views');
              }
          }
          else {
              res.status(403).json({
                  message: 'You are not authorized to view this recipe',
              })
          }
      }
      // return the recipe
      res.status(200).json({
        recipe: recipe
      })
    } 
    else {
      // the recipe was not found
      res.status(404).json({
        message: 'Recipe not found.'
      })
    }
});

// update the recipe matching the request parameter
router.put('/:recipeId', validateSession, (req, res) => {
    let recipeId = req.params.recipeId;
    const updateRecipe = {
        name: req.body.recipe.name,
        category: req.body.recipe.category,
        directions: req.body.recipe.directions,
        cookTime: req.body.recipe.cookTime,
        servings: req.body.recipe.servings,
        isPublic: req.body.recipe.isPublic,
        photoURL: req.body.recipe.photoURL,
    };
    const query = { where: { id: recipeId, userId: req.user.id } };
    console.log(query);
    Recipe.update(updateRecipe, query)
        .then((recipes) =>
            res
                .status(200)
                .json({ recipes, message: 'Recipe successfully updated' })
        )
        .catch((err) =>
            res
                .status(500)
                .json({ error: err, message: 'Error: Recipe not updated' })
        );
});

//delete the recipe
router.delete('/:recipeId', validateSession, (req, res) => {
    let recipeId = req.params.recipeId;

    const query = { where: { id: recipeId, userId: req.user.id } };

    Recipe.destroy(query)
        .then(() => res.status(200).json({ message: 'Recipe Deleted' }))
        .catch((err) =>
            res
                .status(500)
                .json({ error: err, message: 'Error: Recipe not deleted' })
        );
});

module.exports = router;
