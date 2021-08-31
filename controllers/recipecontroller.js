let router = express.Router();
const recipe = require("../db").import("./models/recipe");


router.post("/", (req,res)
=> {
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
    .catch((err) => res.status(500).json({
        error: err
    }));
});

router.get("/", (req,res)
=> {let userid = req.user.id;
recipe.findAll({
    where: { user_id: userid },
    })
    .then((recipes) => res.status(200).json (recipes))
    .catch((err) => res.status(500).json({
        error: err
    }));
});

router.get("/:entryId", function (req,res)
 {
     let userid = req.user.id;
recipe.findAll({
    where: { id: entryId, user_id: userid },
    })
    .then((recipes) => res.status(200).json (recipes))
    .catch((err) => res.status(500).json({
        error: err
    }));
});

router.put("/update/:id", 
function (req, res){
    const updateRecipeEntry = {
        name: req.body.name,
directions: req.body.directions,
cookTime: req.body.cookTime,
servings: req.body.servings,
public: req.body.public,
photoURL: req.body.photoURL,
    };
    const query = { where: {id: req.params.entryId, user_id: req.user.id } };
    Recipe.update(updateLogEntry, query)
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) => res.status(500).json({ error: err }));

    router.delete("/delete/:entryId",
    function (req, res) {
        const query = {where: {id: req.params.entryId, user_id: req.user.id } };

        Recipe.destroy(query)
          .then(() => res.status(200).json({ message: "Recipe Deleted" }))
          .catch((err) => res.status(500).json({ error: err }));
      });
      
      module.exports = router;
