import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import './AddMedicine.css';

const AddMedicine = () => {
    const [name, setName] = useState("");
    const [stock, setStock] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success or error
    const [medicineLimitReached, setMedicineLimitReached] = useState(false);

    const storedToken = localStorage.getItem("token");
    const token = useSelector((state) => state.auth.token) || storedToken;

    // Persist token when available
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        }
    }, [token]);

    // Fetch medicines on load
    useEffect(() => {
        const fetchMedicines = async () => {
            if (!token) {
                setMessage("You are not logged in. Please log in again.");
                setMessageType("error");
                return;
            }

            try {
                const response = await axios.get("http://localhost:8000/api/medicines/", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setMedicines(response.data);

                // Check if user has reached medicine limit
                if (response.data.length >= 5) {
                    setMedicineLimitReached(true);
                    setMessage("Medicine limit (5) reached. You cannot add more.");
                    setMessageType("error");
                } else {
                    setMedicineLimitReached(false);
                    setMessage(""); // Clear any previous error message
                }
            } catch (error) {
                console.error("Error fetching medicines:", error);
                setMessage("Failed to fetch medicines. Please try again.");
                setMessageType("error");
            }
        };

        fetchMedicines();
    }, [token]);

    // Handle adding medicine
    const handleAddMedicine = async () => {
        if (medicineLimitReached) {
            setMessage("You have reached the limit of 5 medicines. Cannot add more.");
            setMessageType("error");
            return;
        }

        if (!name.trim()) {
            setMessage("Medicine name cannot be empty.");
            setMessageType("error");
            return;
        }

        if (!stock || isNaN(stock) || stock <= 0) {
            setMessage("Please enter a valid stock quantity.");
            setMessageType("error");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/medicines/",
                { name, stock },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMedicines([...medicines, response.data]);
            setMessage("Medicine added successfully!");
            setMessageType("success");
            setName("");
            setStock("");

            // Check if limit is reached after adding
            if (medicines.length + 1 >= 5) {
                setMedicineLimitReached(true);
                setMessage("Medicine limit (5) reached. You cannot add more.");
                setMessageType("error");
            }

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (error) {
            setMessage("Failed to add medicine. Please try again.");
            setMessageType("error");
            console.error(error);
        }
    };

    return (
        <div className="add-medicine-container">
            <h2>Add Medicine</h2>
            {/* Display Messages */}
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            {/* Disable fields if the limit is reached */}
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="Medicine Name"
                value={name}
                disabled={medicineLimitReached}
            />

            <input
                type="number"
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock Quantity"
                value={stock}
                disabled={medicineLimitReached}
            />

            <button onClick={handleAddMedicine} disabled={medicineLimitReached}>
                Add Medicine
            </button>

            {/* Medicine List */}
            {/* <h3>Medicine List</h3>
            <div className="medicine-list">
                {medicines.length > 0 ? (
                    medicines.map((medicine, index) => (
                        <div key={index} className="medicine-item">
                            {medicine.name} - {medicine.stock} units
                        </div>
                    ))
                ) : (
                    <p>No medicines added yet.</p>
                )}
            </div> */}
        </div>
    );
};

export default AddMedicine;
