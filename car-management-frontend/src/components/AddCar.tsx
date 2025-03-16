import React, { useState } from "react";
import Select from "react-select";
import allCarBrands from "../data/carBrands"; // Lista cu toate mărcile
import allCarModels from "../data/carModels"; // Lista cu toate modelele
import { FaPlus } from "react-icons/fa";

// 🔹 Generează ani de la 1950 până în prezent în ordine descrescătoare
const years = Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => ({
    value: (new Date().getFullYear() - i).toString(),
    label: (new Date().getFullYear() - i).toString()
}));

const AddCar = ({ onCarAdded }: { onCarAdded: () => void }) => {
    const [marca, setMarca] = useState<{ value: string; label: string } | null>(null);
    const [model, setModel] = useState<{ value: string; label: string } | null>(null);
    const [an, setAn] = useState<{ value: string; label: string } | null>(null);
    const [pret, setPret] = useState<number | "">("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ Verifică dacă toate câmpurile sunt completate
        if (!marca || !model || !an || pret === "" || Number(pret) <= 0) {
            alert("Toate câmpurile sunt obligatorii și prețul trebuie să fie pozitiv!");
            return;
        }

        const newCar = {
            marca: marca.value,
            model: model.value,
            an: an.value,
            pret: Number(pret),
        };

        const response = await fetch("http://localhost:8080/cars", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCar),
        });

        if (response.ok) {
            setMarca(null);
            setModel(null);
            setAn(null);
            setPret("");
            onCarAdded(); // 🔄 Reîncarcă lista
        } else {
            console.error("Eroare la adăugare!");
        }
    };

    return (
        <div className="max-w-screen-md mx-auto mt-5 p-9 bg-gray-200 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Adaugă o mașină</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* 🔹 Select Marca */}
                <Select
                    options={allCarBrands}
                    placeholder="Selectează marca"
                    value={marca}
                    onChange={(selectedOption) => {
                        setMarca(selectedOption);
                        setModel(null); // Reset modelul când marca se schimbă
                    }}
                    className="text-gray-900"
                />

                {/* 🔹 Select Model */}
                <Select
                    options={marca ? allCarModels[marca.value] || [] : []}
                    placeholder="Selectează modelul"
                    value={model}
                    onChange={setModel}
                    isDisabled={!marca}
                    className="text-gray-900"
                />

                {/* 🔹 Select An */}
                <Select
                    options={years}
                    placeholder="Selectează anul"
                    value={an}
                    onChange={setAn}
                    className="text-gray-900"
                />

                {/* 🔹 Input Preț */}
                <input
                    type="number"
                    placeholder="Preț (€)"
                    value={pret}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        setPret(value < 0 ? 0 : value); // Dacă utilizatorul introduce un număr negativ, îl setează automat la 0
                    }}
                    className="w-full p-2 border rounded text-gray-900 bg-white"
                    required
                />

                {/* 🔹 Buton Adăugare */}
                <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                    <FaPlus/> Adaugă
                </button>
            </form>
        </div>
    );
};

export default AddCar;
