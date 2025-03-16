import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import CarList from "./components/CarList";
import AddCar from "./components/AddCar";
import Navbar from "./components/Navbar"; // 🔹 Importăm Navbar-ul

function App() {
    // 🌓 Dark Mode - verifică preferințele salvate
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        // 🔹 Aplica tema pe <html>
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // 🔄 Refresh UI după adăugare
    const [refresh, setRefresh] = useState(0);

    return (
        <Router>
            <div className={`${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col`}>

                {/* 🔹 Navbar fixat sus */}
                <Navbar onThemeToggle={setDarkMode} />

                {/* 🔹 Container pentru conținut, cu flex-grow pentru ocuparea întregului ecran */}
                <div className="flex-1 flex items-center justify-center w-full p-6 transition-all duration-300">
                    <Routes>
                        <Route path="/" element={<CarList key={refresh} />} />
                        <Route path="/add" element={<AddCar onCarAdded={() => setRefresh((prev) => prev + 1)} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
