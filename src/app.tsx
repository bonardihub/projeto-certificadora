import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Page from "./components/page";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/page" element={<Page />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}
