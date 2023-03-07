import React from "react";
import "./App.css";
import {Route, Routes} from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={"/"} element={<HomePage />}></Route>
        <Route path={"/chats"} element={<ChatPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
