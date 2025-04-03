import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "./Navbar"; // Ensure Navbar is imported correctly
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "./MedicineList.css";

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [newStock, setNewStock] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const medicinesPerPage = 2;
    const token = useSelector((state) => state.auth.token);

    const location = useLocation();
    const searchTerm = new URLSearchParams(location.search).get("search");

    // Memoize fetchMedicines using useCallback to avoid unnecessary re-renders
    const fetchMedicines = useCallback(() => {
        if (!token) return;
        axios
            .get("http://localhost:8000/api/medicines/", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log("Fetched Medicines:", res.data);  // Log the fetched medicines
                setMedicines(res.data);
                setFilteredMedicines(res.data);
            })
            .catch((error) => {
                console.error("Error fetching medicines:", error);
                alert("Failed to fetch medicines. Please try again.");
            });
    }, [token]);

   

    const handleSearch = useCallback((searchTerm) => {
        let filtered = medicines;
    
        // Filter based on search term
        if (searchTerm) {
            filtered = medicines.filter((med) =>
                med.name.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
        }
    
        setFilteredMedicines(filtered);
    
        // Recalculate total pages based on the filtered list
        const totalPages = Math.ceil(filtered.length / medicinesPerPage);
    
        // Adjust currentPage if it exceeds the total pages available
        if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1); // Go to last page if there are results, or page 1 if no results
        }
    }, [medicines, currentPage]);
    

    useEffect(() => {
        fetchMedicines();
    }, [token, fetchMedicines]);

    useEffect(() => {
        handleSearch(searchTerm);  // Handle search term change
    }, [searchTerm, medicines, handleSearch]);

    const handleUpdateMedicine = (id) => {
        if (!editName.trim()) {
            alert("Medicine name cannot be empty.");
            return;
        }

        if (!newStock || isNaN(newStock) || newStock <= 0) {
            alert("Please enter a valid stock quantity.");
            return;
        }

        axios
            .patch(
                `http://localhost:8000/api/medicines/${id}/`,
                { name: editName, stock: Number(newStock) },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                setMedicines((prev) =>
                    prev.map((med) =>
                        med.id === id ? { ...med, name: editName, stock: Number(newStock) } : med
                    )
                );
                setFilteredMedicines((prev) =>
                    prev.map((med) =>
                        med.id === id ? { ...med, name: editName, stock: Number(newStock) } : med
                    )
                );
                setEditId(null);
                setNewStock("");
                setEditName("");
            })
            .catch((error) => {
                console.error("Error updating medicine:", error);
                alert("Failed to update medicine. Please try again.");
            });
    };

    const handleDeleteMedicine = (id) => {
        if (window.confirm("Are you sure you want to delete this medicine?")) {
            axios
                .delete(`http://localhost:8000/api/medicines/${id}/delete/`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    // Update medicines and filteredMedicines after deletion
                    const newMedicines = medicines.filter((med) => med.id !== id);
                    const newFilteredMedicines = filteredMedicines.filter((med) => med.id !== id);
    
                    setMedicines(newMedicines);
                    setFilteredMedicines(newFilteredMedicines);
    
                    // Recalculate total pages
                    const totalPages = Math.ceil(newFilteredMedicines.length / medicinesPerPage);
    
                    // Check if the current page is the last one and now exceeds the total number of pages
                    if (currentPage > totalPages) {
                        // If currentPage exceeds total pages, go to the previous page
                        setCurrentPage(totalPages > 0 ? totalPages : 1);
                    }
                })
                .catch((error) => {
                    console.error("Error deleting medicine:", error);
                    alert("Failed to delete medicine.");
                });
        }
    };
    
    // Pagination logic
    const indexOfLastMedicine = currentPage * medicinesPerPage;
    const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
    const currentMedicines = filteredMedicines.slice(indexOfFirstMedicine, indexOfLastMedicine);
    // Update pagination buttons visibility based on filteredMedicines length
    // const totalPages = Math.ceil(filteredMedicines.length / medicinesPerPage);

    return (
        <div className="medicine-list-container">
            <Navbar onSearch={handleSearch} />
            <h2 className="title">Medicine List</h2>

            {/* No results found message */}
            {filteredMedicines.length === 0 ? (
                <p className="no-results-message">No results found</p>
            ) : (
                <div className="medicine-cards">
                    {currentMedicines.map((med) => (
                        <div className="medicine-card" key={med.id}>
                            {editId === med.id ? (
                                <div className="edit-stock">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="New Name"
                                    />
                                    <input
                                        type="number"
                                        value={newStock}
                                        onChange={(e) => setNewStock(e.target.value)}
                                        placeholder="New Stock"
                                        min="1"
                                    />
                                    <button onClick={() => handleUpdateMedicine(med.id)} className="btn save">
                                        Save
                                    </button>
                                    <button onClick={() => setEditId(null)} className="btn cancel">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="medicine-name">{med.name}</h3>
                                    <p className="stock-info">Stock: <span>{med.stock} units</span></p>
                                    <p className="added-date">Added on: {new Date(med.created_at).toLocaleString()}</p>
                                    <div className="btn-group">
                                        <button onClick={() => { 
                                            setEditId(med.id); 
                                            setEditName(med.name); 
                                            setNewStock(med.stock); 
                                        }} className="btn edit">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteMedicine(med.id)} className="btn delete">
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* <div className="pagination">
                <button
                    disabled={currentPage === 1 || filteredMedicines.length === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn pagination-btn"
                >
                    ◀ Previous
                </button>
                <span>Page {currentPage} of {filteredMedicines.length > 0 ? Math.ceil(filteredMedicines.length / medicinesPerPage) : 1}</span>
                <button
                    disabled={
                        currentPage === Math.ceil(filteredMedicines.length / medicinesPerPage) || filteredMedicines.length === 0
                    }
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn pagination-btn"
                >
                    Next ▶
                </button>
            </div> */}

<div className="pagination">
    <button
        disabled={currentPage === 1 || filteredMedicines.length === 0}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className="btn pagination-btn"
    >
        ◀ Previous
    </button>
    <span>
        Page {currentPage} of {filteredMedicines.length > 0 ? Math.ceil(filteredMedicines.length / medicinesPerPage) : 1}
    </span>
    <button
        disabled={currentPage === Math.ceil(filteredMedicines.length / medicinesPerPage) || filteredMedicines.length === 0}
        onClick={() => {
            const totalPages = Math.ceil(filteredMedicines.length / medicinesPerPage);
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        }}
        className="btn pagination-btn"
    >
        Next ▶
    </button>
</div>

        </div>
    );
};

export default MedicineList;
