const router = require('express').Router();
const sequelize = require('../db');
const Recipe = sequelize.import('../models/recipe');
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
        views
    } = req.body.recipe;
    try {
        const newRecipe = await Recipe.create({
            name: name,
            category: category.toLowerCase(),
            directions: directions,
            cookTime: cookTime,
            servings: servings,
            photoURL: photoURL,
            isPublic: isPublic,
            userId: user.id,
            owner: user.username,
            views: views
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
        console.log(error);
    }
});
// get all recipes for a user
router.get('/mine', validateSession, (req, res) => {
    const user = req.user;
    user.getRecipes()
        .then((recipes) => res.status(200).json(recipes))
        .catch((err) =>
            res
                .status(500)
                .json({ error: err, message: 'Error: No recipes found' })
        );
});

router.get('/owner/:username', async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            where: { owner: req.params.username, isPublic: true },
        });
        if (recipes.length > 0) {
            res.status(200).json({
                recipes: recipes,
            });
        } else {
            res.status(404).json({
                message: 'No recipes found.',
            });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Internal error' });
    }
});
const formatQuery = (query) => {
    const { orderby, direction } = query ?? { };

    const formatDirection = d => d === 'decreasing' ? 'DESC' : 'ASC';

    if(orderby) {
        switch(orderby) {
            case 'views':
                return ['views', formatDirection(direction)];
            case 'date':
                return ['createdAt', formatDirection(direction)];
            default: 
                return;
        }
    }

}
router.get('/category/:cat', async (req, res) => {
    const order = formatQuery(req.query);  
    const page = req.query.page ?? 1; 
    try {
        const count = await Recipe.count({where: {category: req.params.cat, isPublic: true}})
        const recipes = await Recipe.findAll({
            where: { category: req.params.cat, isPublic: true },
            order: order ? [order] : undefined,
            limit: 28,
            offset: 28*(page - 1)
        });
        if (recipes.length > 0) {
            res.status(200).json({
                recipes: recipes,
                pages: Math.ceil(count / 28)
            });
        } else {
            res.status(404).json({
                message: 'No recipes found.',
            });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Internal error' });
    }
});
// get all publicly available recipes
router.get('/', (req, res) => {
    Recipe.findAll({
        where: { isPublic: true },
        order: sequelize.random()
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
    if (recipe !== null) {
        // if a token was sent with the request and the associated user is not the creator of the recipe
        // the views of the recipe will increase

        // the request had no token or the user is different from the recipe creator
        if (user?.username !== recipe.owner) {
            // check to see if the recipe if public
            if (recipe.isPublic) {
                // the request had a token, so the recipe views are incremented
                if (user !== undefined) {
                    recipe = await recipe.increment('views');
                }
            }
            // the recipe is not public and is being requested by somebody other than the owner, deny the request
            else {
                res.status(403).json({
                    message: 'You are not authorized to view this recipe',
                });
            }
        }
        // return the recipe
        res.status(200).json({
            recipe: recipe,
        });
    } else {
        // the recipe was not found
        res.status(404).json({
            message: 'Recipe not found.',
        });
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
    const query = { where: { id: recipeId, owner: req.user.username } };
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

    const query = { where: { id: recipeId, owner: req.user.username } };

    Recipe.destroy(query)
        .then(() => res.status(200).json({ message: 'Recipe Deleted' }))
        .catch((err) =>
            res
                .status(500)
                .json({ error: err, message: 'Error: Recipe not deleted' })
        );
});

module.exports = router;
