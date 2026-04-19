import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Form from "./components/Form";
import Navbar from "./components/Navbar";
import Results from "./components/Results";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/form" element={<Form />} />
        <Route path = "/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;