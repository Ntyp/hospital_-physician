import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/routes/Login";
import Register from "./components/routes/Register";
import Home from "./components/routes/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route path='Login' element={<Login />} />
          <Route path='Register' element={<Register />} />
          <Route path='Home' element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
