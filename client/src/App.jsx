import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Homepage} exact />
        <Route path="/chats" Component={ChatPage} />
      </Routes>
    </>
  );
}

export default App;
