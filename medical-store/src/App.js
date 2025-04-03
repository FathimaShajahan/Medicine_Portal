import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./components/Login";
import Signup from "./components/Signup";
import MedicineList from "./components/MedicineList";
import AddMedicine from "./components/AddMedicine";
import { useSelector } from "react-redux";
import Home from "./components/Home";
function App() {
    const token = useSelector((state) => state.auth.token);
    
    

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {token && (
                    <>
                        <Route path="/" element={<Home />} />
                        <Route path="/list-medicine" element={<MedicineList/>} />
                        <Route path="/add-medicine" element={<AddMedicine/>} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
