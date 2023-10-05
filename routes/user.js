const router = require("express").Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      const ids = user.favorite;
      Recipe.find({ _id: { $in: ids } })
        .then((favorites) => {
          // console.log(favorites);
          res.status(200).json(favorites);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.get("/creator/:id", (req, res, next) => {
  Recipe.find({ creatorId: req.params.id })
    .then((recipe) => {
      // console.log(recipe);
      res.status(200).json(recipe);
    })
    .catch((err) => next(err));
});

router.put("/:id", (req, res, next) => {
  // console.log(req.body);
  User.findByIdAndUpdate(
    req.params.id,
    {
      favorite: [...req.body.favorite],
    },
    { new: true }
  )
    .then((updatedUser) => {
      console.log("add one:", updatedUser);
      res.status(200).json(updatedUser);
    })
    .catch((err) => next(err));
});

router.delete("/:id", (req, res, next) => {
  // console.log(req.body.favorite);
  User.findByIdAndUpdate(
    req.params.id,
    {
      favorite: [...req.body.favorite],
    },
    { new: true }
  )
    .then((updatedUser) => {
      console.log("delete one : ", updatedUser);
      res.status(200).json(updatedUser);
    })
    .catch((err) => next(err));
});

module.exports = router;
