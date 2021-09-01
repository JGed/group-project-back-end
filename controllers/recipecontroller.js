const router = require('express').Router();
const Recipe = require('../db').import('./models/recipe');

// create a new recipe
router.post('/', (req, res) => {
    const recipeEntry = {
        name: req.body.name,
        directions: req.body.directions,
        cookTime: req.body.cookTime,
        servings: req.body.servings,
        public: req.body.public,
        photoURL: req.body.photoURL,
    };
    Log.create(recipeEntry)
        .then((recipe) => res.status(200).json(recipe))
        .catch((err) =>
            res.status(500).json({
                error: err,
            })
        );
});
// get all recipes for a user
router.get('/', validateSession, (req, res) => {
    let userid = req.user.id;
    Recipe.findAll({
        where: { user_id: userid },
    })
        .then((recipes) => res.status(200).json(recipes))
        .catch((err) =>
            res.status(500).json({
                error: err,
            })
        );
});

// get all publicly available recipes
router.get('/', (req, res) => {
    Recipe.findAll({
        where: { public: true },
    })
        .then((recipes) => res.status(200).json(recipes))
        .catch((err) =>
            res.status(500).json({
                error: err,
            })
        );
});
// get recipe with id matching the request parameter
router.get('/:entryId', (req, res) => {
    let userid = req.user.id;
    Recipe.findAll({
        where: { id: entryId, user_id: userid },
    })
        .then((recipes) => res.status(200).json(recipes))
        .catch((err) =>
            res.status(500).json({
                error: err,
            })
        );
});
// update the recipe matching the request parameter
router.put('/update/:id', (req, res) => {
    const updateRecipeEntry = {
        name: req.body.name,
        directions: req.body.directions,
        cookTime: req.body.cookTime,
        servings: req.body.servings,
        public: req.body.public,
        photoURL: req.body.photoURL,
    };
    const query = { where: { id: req.params.entryId, user_id: req.user.id } };
    Recipe.update(updateRecipeEntry, query)
        .then((recipes) => res.status(200).json(recipes))
        .catch((err) => res.status(500).json({ error: err }));
});

router.delete('/delete/:entryId', (req, res) => {
    const query = { where: { id: req.params.entryId, user_id: req.user.id } };

    Recipe.destroy(query)
        .then(() => res.status(200).json({ message: 'Recipe Deleted' }))
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
