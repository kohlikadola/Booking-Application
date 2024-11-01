import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import Layout from "./layouts/Layout.tsx";
import Register from "./pages/Register.tsx";
import SignIn from "./pages/SignIn.tsx";
import AddHotel from "./pages/AddHotel.tsx";
import MyHotels from "./pages/MyHotels.tsx";
import {useAppContext} from "./contexts/AppContext"; 
const App = () => {
  const {isLog}=useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout className="text-4xl"><p>Home Page</p></Layout>} />
        <Route path="/search" element={<Layout className="text-4xl"><p>Search Page</p></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/login" element={<Layout ><SignIn /></Layout>} />
        {isLog && (<>
            <Route path="/add-hotel" element={
            <Layout><AddHotel /></Layout>
            } />
            <Route path="/my-hotels" element={
            <Layout><MyHotels /></Layout>
            } />
        </>)}
       <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

