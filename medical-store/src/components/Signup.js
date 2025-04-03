import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Signup.css';  // Import the CSS file

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const formData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await axios.post('http://localhost:8000/api/register/', formData);
            console.log('Registration successful:', response.data);
            alert("User signed up successfully!");
            navigate('/login'); // Redirect to login after successful registration
        } catch (error) {
            console.error('Error during registration:', error.response ? error.response.data : error.message);
            setError('Error during registration. Please try again.');
        }
    };

    return (
        <div className="signup-container ">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="signup-btn">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
