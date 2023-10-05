const router = require("express").Router();
const Recipe = require("../models/Recipe");

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

// get all recipes
router.get("/", (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((err) => next(err));
});

// POST '/api/upload' => Route that will receive an image, send it to Cloudinary via the fileUploader and return the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log('file is: ', req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  // get the URL of the uploaded file and send it as a response.
  // 'secure_url' can be any name, just make sure you remember to use the same when accessing it on the frontend
  console.log(req.file.path);
  res.json({ secure_url: req.file.path });
});

// create a recipe
router.post("/", (req, res, next) => {
  const {
    strMeal,
    strCategory,
    strArea,
    strMealThumb,
    Ingredients,
    Instructions,
    strTags,
    creatorId,
  } = req.body;
  Recipe.create({
    strMeal,
    strCategory,
    strArea,
    strMealThumb,
    Ingredients,
    Instructions,
    strTags,
    creatorId,
  })
    .then((recipe) => {
      // we return http status code 201 - created
      res.status(201).json(recipe);
    })
    .catch((err) => {
      next(err);
    });
});

// get a specific recipe
router.get("/:id", (req, res, next) => {
  Recipe.findById(req.params.id)
    .then((recipe) => {
      // check if the id is not valid
      // if (!mongoose.Types.ObjectId.isValid(req.params.id))

      if (!recipe) {
        res.status(404).json(recipe);
      } else {
        res.status(200).json(recipe);
      }
    })
    .catch((err) => {
      next(err);
    });
});

//update recipe
router.put("/:id", (req, res, next) => {
  const {
    strMeal,
    strCategory,
    strArea,
    strMealThumb,
    Ingredients,
    Instructions,
    strTags,
  } = req.body;
  Recipe.findByIdAndUpdate(
    req.params.id,
    {
      strMeal: strMeal,
      strCategory: strCategory,
      strArea: strArea,
      strMealThumb: strMealThumb,
      Ingredients: Ingredients,
      Instructions: Instructions,
      strTags: strTags,
    },
    { new: true }
  )
    .then((updatedRecipe) => {
      res.status(200).json(updatedRecipe);
    })
    .catch((err) => next(err));
});

// delete a recipe
router.delete("/:id", (req, res, next) => {
  Recipe.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).json({ message: "recipe deleted" });
  });
});

module.exports = router;
