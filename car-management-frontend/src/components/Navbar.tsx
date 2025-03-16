import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = ({ onThemeToggle }: { onThemeToggle: (darkMode: boolean) => void }) => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        onThemeToggle(darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode, onThemeToggle]);

    return (
        <nav className="bg-blue-700 dark:bg-gray-900 p-4 shadow-md">
            <div className="container mx-auto flex flex-wrap  space-x-15 items-center">
                {/* 🔹 Logo & Home */}
                <Link to="/add" className="flex items-center text-white text-2xl font-bold no-underline hover:text-gray-300 transition">
                    🚗 Car Management
                </Link>

                {/* 🔹 Link-uri */}
                <div className="flex items-center space-x-15">
                    <Link to="/" className="text-white no-underline hover:text-gray-300 text-lg transition">
                        Lista Mașini
                    </Link>
                    <Link to="/add" className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md no-underline hover:bg-gray-200 transition">
                        ➕ Adaugă Mașină
                    </Link>

                    {/* 🌙 Dark Mode Toggle */}
                    <div className="flex items-center justify-start">
                        <Toggle
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            icons={{
                                checked: <FaMoon className="text-white text-sm" />,
                                unchecked: <FaSun className="text-yellow-400 text-sm" />,
                            }}
                            className="mx-2"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
