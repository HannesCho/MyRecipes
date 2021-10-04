import "./App.css";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RecipeListPage from "./pages/RecipeListPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import EditRecipePage from "./pages/EditRecipePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App(props) {
  const [user, setUser] = useState(props.user);

  const addUser = (user) => {
    setUser(user);
  };

  console.log("App js: ", user);

  return (
    <div className="App">
      <Navbar user={user} setUser={addUser} />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/recipes" component={RecipeListPage} />
        {/* <Route
          exact path="/projects"
          render={props => {
            if (user) {
              return <ProjectListPage {...props} />
            } else {
              return <Redirect to="/" />
            }
          }}
        /> */}
        {/* <ProtectedRoute
          exact
          path="/recipes"
          user={user}
          component={RecipeListPage}
        /> */}
        {/* <Route exact path="/projects/:id" component={ProjectDetailsPage} /> */}
        <ProtectedRoute
          exact
          path="/recipe/:id"
          user={user}
          component={RecipeDetailsPage}
          redirect="/login"
        />
        <Route exact path="/recipe/edit/:id" component={EditRecipePage} />
        <Route
          exact
          path="/signup"
          render={(props) => <Signup setUser={addUser} {...props} />}
        />
        <Route
          exact
          path="/login"
          render={(props) => <Login setUser={addUser} {...props} />}
        />
      </Switch>
    </div>
  );
}

export default App;
