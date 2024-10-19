import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout.tsx";
import Register from "./pages/Register.tsx";
import SignIn from "./pages/SignIn.tsx"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout className="text-4xl"><p>Home Page</p></Layout>} />
        <Route path="/search" element={<Layout className="text-4xl"><p>Search Page</p></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/login" element={<Layout ><SignIn /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;

