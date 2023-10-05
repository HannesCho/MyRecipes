import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";

export default function RecipeListPage(props) {
  // we don't need this bc we are using the proxy in package.json
  const API_URL=process.env.API_URL

  const [user, setUser] = useState(props.user);
  const [recipes, setRecipes] = useState([]);
  const [favorite, setFavorite] = useState(
    props.user ? props.user.favorite : null
  );
  const [thisItems, setThisItems] = useState([]);
  const [thisPage, setThisPage] = useState(1);
  const [pages, setPages] = useState([]);

  const userId = props.user._id;

  const getUser = () => {
    axios
      .get(`${API_URL}/auth/loggedin`)
      .then((res) => {
        setUser(res.data);
        setFavorite(res.data.favorite);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  //get all recipes <= functions
  const getAllRecipes = () => {
    // get request to the server
    axios
      .get(`api/recipes`)
      .then((res) => {
        console.log(res);
        setRecipes(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // get all the recipes from the server
    getAllRecipes();
    // bc of the empty dependency array we only get all the recipes
    // on the first render (when the component is mounted)
  }, []);

  // handle favorite recipes <= functions

  useEffect(() => {
    setFavorite(props.user.favorite);
  }, [props.user.favorite]);

  const handleFavorite = (id) => {
    if (user) {
      if (!favorite.includes(id)) {
        axios
          .put(`${API_URL}/user/${userId}`, {
            favorite: [...favorite, id],
          })
          .then((res) => {
            setFavorite([...favorite, id]);
            console.log("add fav:", favorite);
            console.log("added user:", res.data);
          })
          .catch((err) => console.log(err));
      } else {
        const filtedIds = favorite.filter((el) => {
          if (el !== id) {
            console.log(el);
            console.log(id);
            return true;
          } else {
            return false;
          }
        });
        console.log(filtedIds);
        axios
          .delete(`${API_URL}/user/${userId}`, {
            data: { favorite: [...filtedIds] },
          })
          .then((res) => {
            console.log("thisis res.data:", res.data);
            setFavorite(res.data.favorite);
            console.log("this is fav:", favorite);
          })
          .catch((err) => console.log(err));
      }
    } else {
      setFavorite(null);
    }
  };

  //search with name, category, area and tags
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filteredRecipe = () => {
      console.log(search);
      return recipes
        .sort((a, b) => {
          return a.strMeal.localeCompare(b.strMeal);
        })
        .filter((recipe) =>
          `${recipe.strMeal}${recipe.strCategory}${recipe.strArea}${recipe.strTags}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );
    };
    // only 20 items in one page
    const handleItems = () => {
      if (filteredRecipe().length > 20) {
        console.log(filteredRecipe());
        setThisItems(
          filteredRecipe().slice((thisPage - 1) * 20, (thisPage - 1) * 20 + 20)
        );
      } else {
        setThisItems(filteredRecipe());
      }
    };

    const getPages = () => {
      if (filteredRecipe().length > 20) {
        const totalPages = Math.floor(filteredRecipe().length / 20) + 1;
        const pagesArr = [];
        for (let i = 1; i <= totalPages; i++) {
          pagesArr.push(i);
        }
        setPages(pagesArr);
        console.log(pages);
      } else {
        setPages([1]);
      }
    };
    filteredRecipe();
    handleItems();
    getPages();
  }, [thisPage, recipes, search, pages]);

  const handleThisPage = (e) => {
    setThisPage(e.target.value);
  };

  return (
    <div className="recipes-container">
      <div className="search-box">
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find your Recipe"
        />
      </div>
      <h1 className="list-title">All Recipes</h1>
      <div className="pages">
        {pages.map((page) => {
          return (
            <>
              {page === pages.length ? (
                <>
                  {" "}
                  <button onClick={handleThisPage} value={page}>
                    {page}
                  </button>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <button onClick={handleThisPage} value={page}>
                    {page}
                  </button>
                  <span>/</span>
                </>
              )}
            </>
          );
        })}
      </div>
      <div className="cards-box">
        {thisItems
          .sort((a, b) => {
            return a.strMeal.localeCompare(b.strMeal);
          })
          .map((recipe) => (
            <RecipeCard
              key={recipe._id}
              user={props.user}
              favorite={favorite}
              handleFavorite={handleFavorite}
              {...recipe}
            />
          ))}
      </div>
    </div>
  );
}
