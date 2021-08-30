const router = require('express').Router()
const validateSession = require('../middleware/validate-session');
const Recipe = require('../db').import('../models/recipe');

router.get('/practice', validateSession, (req, res) => {
    res.send('Hey!! This is a practice route!');
})

/*
    get all recipes associated with the user
*/
router.get('/mine', validateSession, async (req, res) => {
    const user = req.user;
    try{
        const recipes = await user.getRecipes();
        res.status(200).json({
            "recipes": recipes
        })
    } catch(error) {
        res.status(500).json({
            message: 'An error occured. Please try again.',
            error: error
        })
    }

})

/*
    create a new recipe
*/
router.post('/create', validateSession, async (req, res) => {
    const user = req.user;
    const {
        name,
        category,
        directions,
        cookTime, 
        servings,
        photoURL,
        isPublic
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
            userId: user.id
        })
        res.status(200).json({
            message: 'Recipe successfully created!',
            recipe: newRecipe
        })
    } catch(error) {
        res.status(500).json({
            error: error
        })
    }
})
module.exports = router;