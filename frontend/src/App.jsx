import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./components/Home";
import Form from "./components/Form";
import Results from "./components/Results";
import Assessment from "./components/Assessment";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/results" element={<Results />} />
        <Route path="/assessment" element={<Assessment />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;