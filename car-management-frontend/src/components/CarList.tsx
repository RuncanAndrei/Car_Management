import { useEffect, useState } from "react";

interface Car {
    id: number;
    marca: string;
    model: string;
    an: number;
    pret: number;
}

const CarList = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCars, setSelectedCars] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // 🔄 Fetch lista de mașini
    const fetchCars = () => {
        fetch("http://localhost:8080/cars")
            .then((response) => response.json())
            .then((data) => setCars(data))
            .catch((error) => console.error("Eroare la preluarea mașinilor:", error));
    };

    useEffect(() => {
        fetchCars();
    }, []);

    // 🗑️ Șterge o singură mașină
    const deleteCar = async (id: number) => {
        if (!window.confirm("Sigur vrei să ștergi această mașină?")) return;

        const response = await fetch(`http://localhost:8080/cars/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            setCars(cars.filter(car => car.id !== id));
            setSelectedCars(selectedCars.filter(carId => carId !== id));
        } else {
            console.error("Eroare la ștergere!");
        }
    };

    // ✅ Selectează/Deselectează o mașină
    const toggleSelectCar = (id: number) => {
        setSelectedCars((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter(carId => carId !== id)
                : [...prevSelected, id]
        );
    };

    // 🔴 Șterge mașinile selectate
    const deleteSelectedCars = async () => {
        if (selectedCars.length === 0) return;

        if (!window.confirm("Sigur vrei să ștergi mașinile selectate?")) return;

        for (const id of selectedCars) {
            await fetch(`http://localhost:8080/cars/${id}`, { method: "DELETE" });
        }

        setCars(cars.filter(car => !selectedCars.includes(car.id)));
        setSelectedCars([]);
    };

    // 🔄 Selectează/Deselectează toate mașinile
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedCars([]); // Deselectează tot
        } else {
            setSelectedCars(cars.map(car => car.id)); // Selectează toate
        }
        setSelectAll(!selectAll);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lista Mașini</h2>

            {/* 🔘 Afișează butoanele doar dacă există mașini */}
            {cars.length > 0 && (
                <div className="flex justify-end gap-2 mb-3">
                    <button
                        onClick={toggleSelectAll}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        {selectAll ? "Deselectează tot" : "Selectează tot"}
                    </button>

                    <button
                        onClick={deleteSelectedCars}
                        disabled={selectedCars.length === 0}
                        className={`px-2 py-1 text-sm text-white rounded-md transition ${
                            selectedCars.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                        🗑️ Șterge selectate ({selectedCars.length})
                    </button>
                </div>
            )}

            {cars.length === 0 ? (
                <p className="text-gray-500 text-center mt-4">🚗 Nu există mașini în sistem.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cars.map((car) => (
                        <div key={car.id} className="flex items-center bg-white p-4 rounded shadow-lg border border-gray-300">
                            {/* ✅ Checkbox pentru selectare */}
                            <input
                                type="checkbox"
                                checked={selectedCars.includes(car.id)}
                                onChange={() => toggleSelectCar(car.id)}
                                className="mr-3"
                            />

                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {car.marca} {car.model} ({car.an})
                                </h3>
                                <p className="text-gray-600">💰 {car.pret} €</p>
                            </div>

                            {/* 🗑️ Buton compact de ștergere */}
                            <button
                                onClick={() => deleteCar(car.id)}
                                className="text-red-500 hover:text-red-700 transition text-sm px-2 py-1"
                                title="Șterge mașina"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarList;
