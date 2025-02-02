import axios from "axios";
import { useState, useEffect } from "react";
//the service file is used to send (and get) the data to(from) the server
import service from "../services/image";

export default function EditProjectPage(props) {
  const [strMeal, setStrMeal] = useState("");
  const [strCategory, setStrCategory] = useState("");
  const [strArea, setStrArea] = useState("");
  const [strTags, setStrTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [Instructions, setInstructions] = useState([""]);

  // handle input change
  const handleInstructionsChange = (e, index) => {
    const { value } = e.target;
    const list = [...Instructions];
    list[index] = value;
    setInstructions(list);
  };

  // handle click event of the Remove button
  const handleInstructionsRemoveClick = (index) => {
    const list = [...Instructions];
    list.splice(index, 1);
    setInstructions(list);
  };

  // handle click event of the Add button
  const handleInstructionsAddClick = () => {
    setInstructions([...Instructions, ""]);
  };
  const [Ingredients, setIngredients] = useState([
    { strIngredient: "", strMeasure: "" },
  ]);

  // handle input change
  const handleIngredientsChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...Ingredients];
    list[index][name] = value;
    setIngredients(list);
  };

  // handle click event of the Remove button
  const handleIngredientsRemoveClick = (index) => {
    const list = [...Ingredients];
    list.splice(index, 1);
    setIngredients(list);
  };

  // handle click event of the Add button
  const handleIngredientsAddClick = () => {
    setIngredients([...Ingredients, { strIngredient: "", strMeasure: "" }]);
  };

  //get current infromation
  const recipeId = props.match.params.id;

  useEffect(() => {
    axios
      .get(`/api/recipes/${recipeId}`)
      .then((response) => {
        setStrMeal(response.data.strMeal);
        setStrCategory(response.data.strCategory);
        setStrArea(response.data.strArea);
        setImageUrl(response.data.strMealThumb);
        setStrTags(response.data.strTags);
        setInstructions(response.data.Instructions);
        setIngredients(response.data.Ingredients);
      })
      .catch((err) => console.log(err));
  }, [recipeId]);

  const deleteRecipe = () => {
    axios
      .delete(`/api/recipes/${recipeId}`)
      .then(() => {
        // redirect to the project list
        props.history.push("/recipes");
      })
      .catch((err) => console.log(err));
  };

  // this upload image to server and retrun url
  const handleImage = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    const uploadData = new FormData();

    // imageUrl => this name has to be the same as in the model since we pass
    // req.body to .create() method when creating a new thing in '/api/things/create' POST route
    uploadData.append("imageUrl", e.target.files[0]);

    service
      .handleUpload(uploadData)
      .then((response) => {
        // console.log("response is: ", response);
        // after the console.log we can see that response carries 'secure_url' which we can use to update the state
        setImageUrl(response.secure_url);
        console.log(imageUrl);
      })
      .catch((err) => console.log("Error while uploading the file: ", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestBody = {
      strMeal,
      strCategory,
      strArea,
      strMealThumb: imageUrl,
      Ingredients,
      Instructions,
      strTags,
    };
    axios
      .put(`/api/recipes/${recipeId}`, requestBody)
      .then((response) => {
        // this is a redirect using react router dom
        props.history.push(`/recipe/${recipeId}`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="edit-container">
      <h3 className="title">Edit this recipe</h3>
      <form onSubmit={handleSubmit}>
        <table>
          <tr className="add-row">
            <td className="row-left">
              <label htmlFor="strMeal">Name: </label>
            </td>
            <td className="row-right">
              {" "}
              <input
                placeholder="Enter Name"
                type="text"
                name="strMeal"
                value={strMeal}
                onChange={(e) => setStrMeal(e.target.value)}
              />
            </td>
          </tr>
          <tr className="add-row">
            <td className="row-left">
              <label htmlFor="strCategory">Category: </label>
            </td>
            <td className="row-right">
              <input
                placeholder="Enter Category"
                type="text"
                name="strCategory"
                value={strCategory}
                onChange={(e) => setStrCategory(e.target.value)}
              />
            </td>
          </tr>
          <tr className="add-row">
            <td className="row-left">
              <label htmlFor="strArea">Area: </label>
            </td>
            <td className="row-right">
              <input
                placeholder="Enter Area"
                type="text"
                name="strArea"
                value={strArea}
                onChange={(e) => setStrArea(e.target.value)}
              />
            </td>
          </tr>
          <tr className="add-row">
            <td className="row-left">
              <label htmlFor="uploadImage">Image: </label>
            </td>
            <td className="row-right">
              {" "}
              <input type="file" name="uploadImage" onChange={handleImage} />
            </td>
          </tr>
          <tr className="add-row">
            <td className="row-left">Image Preview</td>
            <td className="row-right image-preview">
              {" "}
              {imageUrl && (
                <img src={imageUrl} style={{ height: "100px" }} alt="" />
              )}
            </td>
          </tr>
          <tr className="add-row">
            <td className="row-left add-text">
              <label htmlFor="Ingredients">Ingredients: </label>
            </td>
            <td className="row-right add-box">
              {Ingredients.map((x, i) => {
                return (
                  <div className="box" key={i}>
                    <input
                      name="strIngredient"
                      placeholder="Enter Ingredient"
                      value={x.strIngredient}
                      onChange={(e) => handleIngredientsChange(e, i)}
                    />
                    <input
                      name="strMeasure"
                      placeholder="Enter amount"
                      value={x.strMeasure}
                      onChange={(e) => handleIngredientsChange(e, i)}
                    />
                    <div className="btn-box">
                      {Ingredients.length !== 1 && (
                        <button
                          className="mr10"
                          onClick={() => handleIngredientsRemoveClick(i)}
                        >
                          Remove
                        </button>
                      )}
                      {Ingredients.length - 1 === i && (
                        <button
                          className="mr10"
                          onClick={handleIngredientsAddClick}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </td>
          </tr>

          <tr className="add-row">
            <td className="row-left add-text">
              <label htmlFor="Instructions">Instructions: </label>
            </td>
            <td className="row-right add-box">
              {Instructions.map((x, i) => {
                return (
                  <div className="box" key={i}>
                    <input
                      name="Instructions"
                      placeholder="Enter Instructions"
                      value={x}
                      onChange={(e) => handleInstructionsChange(e, i)}
                    />
                    <div className="btn-box">
                      {Instructions.length !== 1 && (
                        <button
                          className="mr10"
                          onClick={() => handleInstructionsRemoveClick(i)}
                        >
                          Remove
                        </button>
                      )}
                      {Instructions.length - 1 === i && (
                        <button
                          className="mr10"
                          onClick={handleInstructionsAddClick}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </td>
          </tr>
          <tr className="add-row">
            <td className="row-left">
              <label htmlFor="strTags">Tags: </label>
            </td>
            <td className="row-right">
              {" "}
              <input
                type="text"
                name="strTags"
                placeholder="Enter Tags"
                value={strTags}
                onChange={(e) => setStrTags(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <button className="update-btn" type="submit">
              Update
            </button>
          </tr>
          <tr>
            <button className="edit-btn" onClick={deleteRecipe}>
              Delete This
            </button>
          </tr>
        </table>
      </form>
    </div>
  );
}
