import { useEffect, useState } from "react";
import {deleteCarById, fetchCars} from "../services/carService";

interface Car {
    id: number;
    marca: string;
    model: string;
    an: number;
    pret: number;
}

const CarList = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCars()
            .then((data) => setCars(data))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Ești sigur că vrei să ștergi această mașină?")) {
            setDeletingId(id);
            setTimeout(async () => {
                const success = await deleteCarById(id);
                if (success) {
                    setCars((prev) => prev.filter((car) => car.id !== id));
                    setMessage("✅ Mașina a fost ștearsă cu succes!");
                    setTimeout(() => setMessage(null), 3000);
                } else {
                    setMessage("❌ Eroare la ștergere!");
                }
                setDeletingId(null);
            }, 500);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-5 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Lista Mașini</h2>

            {/* 🔹 Mesaj de confirmare */}
            {message && (
                <div className="text-center p-2 mb-4 bg-green-500 text-white rounded-lg">
                    {message}
                </div>
            )}

            {/* 🔹 Căutare rapidă */}
            <input
                type="text"
                placeholder="🔍 Caută după marcă sau model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 text-gray-900 border rounded mb-4"
            />

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                </div>
            ) : cars.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">Nu există mașini în sistem.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cars
                        .filter((car) =>
                            car.marca.toLowerCase().includes(search.toLowerCase()) ||
                            car.model.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((car) => (
                            <div
                                key={car.id}
                                className={`p-4 rounded shadow flex justify-between items-center transition-all duration-500 ${
                                    deletingId === car.id ? "opacity-0 scale-90" : "opacity-100 scale-100"
                                } ${
                                    car.pret < 5000 ? "border-l-4 border-green-500" :
                                        car.pret < 15000 ? "border-l-4 border-yellow-500" :
                                            "border-l-4 border-red-500"
                                }`}
                            >
                                <div>
                                    <h3 className="text-lg font-semibold">{car.marca} {car.model} ({car.an})</h3>
                                    <p className="text-gray-600 dark:text-gray-300">💰 {car.pret} €</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(car.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">
                                    🗑️ Șterge
                                </button>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default CarList;
