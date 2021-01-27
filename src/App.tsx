import React from 'react';
import TopBar from "./components/TopBar";
import Home from "./pages/Home";
import {Route, BrowserRouter, Switch} from "react-router-dom";
import ProjectImg from "./pages/ProjectImg";
import "./App.css";
import ProjectRslk from "./pages/ProjectRslk";
import ProjectVeritas from "./pages/ProjectVeritas";
import ProjectVulcanet from "./pages/ProjectVulcanet";

function App() {
  return (
      <div className={"App"}>
          <BrowserRouter>
              <TopBar />
              <Switch>
                  <Route exact path={"/"}>
                      <Home />
                  </Route>
                  <Route path={"/projects/imgproc"}><ProjectImg /></Route>
                  <Route path={"/projects/rslk"}><ProjectRslk /></Route>
                  <Route path={"/projects/veritas"}><ProjectVeritas /></Route>
                  <Route path={"/projects/vulcanet"}><ProjectVulcanet /></Route>
              </Switch>
          </BrowserRouter>
      </div>
  );
}

export default App;
