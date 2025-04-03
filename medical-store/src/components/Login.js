import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../slice/authSlice";
import { useNavigate } from "react-router-dom";
import './Login.css';  // Import the updated CSS file

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:8000/api/login/", { username, password });
            dispatch(login({ token: res.data.access, user: username }));
            navigate("/list-medicine");
        } catch (error) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={(e) => e.preventDefault()} className="login-form">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" onClick={handleLogin} className="login-btn">Login</button>
            </form>
        </div>
    );
};

export default Login;
