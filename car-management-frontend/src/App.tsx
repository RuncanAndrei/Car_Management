import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import CarList from "./components/CarList";
import AddCar from "./components/AddCar";
import Navbar from "./components/Navbar";

function App() {
    // State for dark mode, retrieved from local storage to persist user preference
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    // Effect to update the theme in local storage and apply the corresponding class to the document
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // State to trigger a UI refresh when a new car is added
    const [refresh, setRefresh] = useState(0);

    return (
        <Router>
            <div
                className={`min-h-screen flex flex-col ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
            >
                {/* Navbar component with theme toggle functionality */}
                <Navbar onThemeToggle={setDarkMode} />

                {/* Main content container with flex-grow to fill the remaining space */}
                <div className="flex flex-1 items-center justify-center w-full p-6 transition-all duration-300">
                    <Routes>
                        {/* Car list page - Re-renders when refresh state changes */}
                        <Route path="/" element={<CarList key={refresh} />} />

                        {/* Add car page - Updates refresh state when a new car is added */}
                        <Route path="/add" element={<AddCar onCarAdded={() => setRefresh(prev => prev + 1)} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
