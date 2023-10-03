const router = require("express").Router();
const Recipe = require("../models/Recipe");
const axios = require("axios");

// get all recipes from theMealdb
// router.get("/", (req, res, next) => {
//   const alphabets = "abcdefghijklmnopqrstuvwxyz";
//   let recipesFromDB = [];
//   let promises = [];
//   for (let i = 0; i < alphabets.length; i++) {
//     console.log(alphabets[i]);
//     promises.push(
//       axios
//         .get(
//           `https://www.themealdb.com/api/json/v1/1/search.php?f=${alphabets[i]}`
//         )
//         .then((response) => {
//           recipesFromDB.push(response.data.meals);
//           res.json(response.data.meals);
//         })
//         .catch((err) => next(err))
//     );
//   }
//   Promise.all(promises).then(() => {
//     res.json(recipesFromDB);
//   });
// });

function getDataFromDB(char) {
  const dataFromDB = axios
    .get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${char}`)
    .then((response) => {
      const meals = response.data.meals;
      let createdMeal = [];
      if (meals) {
        meals.forEach((meal) => {
          const {
            strMeal,
            strCategory,
            strArea,
            strInstructions,
            strMealThumb,
            strTags,
          } = meal;
          // make ingredient array from db
          let Ingredients = [];
          for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
              Ingredients.push({
                strIngredient: meal[`strIngredient${i}`],
                strMeasure: meal[`strMeasure${i}`],
              });
            }
          }

          // make recipe array from db
          let InstructionsArray = strInstructions
            .toString()
            .replace(/(\r\n|\n|\r)/gm, "")
            .split(".");
          const Instructions = [];
          for (let i = 0; i < InstructionsArray.length; i++) {
            if (InstructionsArray[i] !== "") {
              Instructions.push(InstructionsArray[i].trim());
            }
          }
          createdMeal.push({
            strMeal,
            strCategory,
            strArea,
            strMealThumb,
            strTags,
            Instructions,
            Ingredients,
          });
        });
        return createdMeal;
      }
    })
    .catch((err) => console.log(err));
  return dataFromDB;
}

router.get("/", (req, res, next) => {
  // const alphabets = "abcdefghijklmnopqrstuvwyz";
  const alphabets = "abcdefgh";
  // for (let el of alphabets) {
  //   (async function () {
  //     const data = await getDataFromDB(el);
  //     console.log(data);
  //     wholeRecipes.push(data);
  //   })();
  // }
  // let eachRecipes = [];
  // for (let recipes of wholeRecipes) {
  //   for (let recipe of recipes) {
  //     eachRecipes.push(recipe);
  //   }
  // }
  // console.log(eachRecipes);
  for (let el of alphabets) {
    let wholeRecipes = [];
    (async function () {
      const data = await getDataFromDB(el);
      wholeRecipes = [...data];
      for (let recipe of wholeRecipes) {
        // console.log(recipe);
        const {
          strMeal,
          strCategory,
          strArea,
          strMealThumb,
          strTags,
          Instructions,
          Ingredients,
        } = recipe;
        Recipe.create({
          strMeal,
          strCategory,
          strArea,
          strMealThumb,
          strTags,
          Instructions,
          Ingredients,
          creatorId: "theMealdb",
        });
      }
    })();
  }
});

module.exports = router;
