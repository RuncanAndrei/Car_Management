import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = ({ onThemeToggle }: { onThemeToggle: (darkMode: boolean) => void }) => {
    const location = useLocation(); // Detectează pagina curentă
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

    useEffect(() => {
        onThemeToggle(darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode, onThemeToggle]);

    return (
        <nav className="bg-blue-600 dark:bg-gray-900 p-4 shadow-md w-full fixed top-0 left-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* 🔹 Logo & Home */}
                <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
                    🚗 Car Management
                </Link>

                {/* 🔹 Link-uri */}
                <div className="flex items-center space-x-6">
                    <Link
                        to="/"
                        className={`text-lg no-underline px-3 py-2 rounded-md transition ${
                            location.pathname === "/" ? "bg-white text-blue-600" : "text-white hover:text-gray-300"
                        }`}
                    >
                        Lista Mașini
                    </Link>
                    <Link
                        to="/add"
                        className={`px-4 py-2 rounded-lg shadow-md transition ${
                            location.pathname === "/add"
                                ? "bg-white text-blue-600"
                                : "bg-gray-200 text-blue-600 hover:bg-gray-300"
                        }`}
                    >
                        ➕ Adaugă
                    </Link>

                    {/* 🌙 Dark Mode Toggle */}
                    <div className="flex items-center">
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
