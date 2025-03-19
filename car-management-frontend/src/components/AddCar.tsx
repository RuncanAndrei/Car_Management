import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { fetchCarBrands, fetchCarModels, addCar } from "../services/carService";

// 🔹 Generate years from 1950 to present (descending)
const years = Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => ({
    value: (new Date().getFullYear() - i).toString(),
    label: (new Date().getFullYear() - i).toString(),
}));

const AddCar = ({ onCarAdded }: { onCarAdded: () => void }) => {
    // 🔹 Form state
    const [marca, setMarca] = useState<{ value: string; label: string } | null>(null);
    const [model, setModel] = useState<{ value: string; label: string } | null>(null);
    const [an, setAn] = useState<{ value: string; label: string } | null>(null);
    const [pret, setPret] = useState<number | "">("");
    const [models, setModels] = useState<{ value: string; label: string }[]>([]);
    const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);

    // 🔹 Loading states
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingModels, setLoadingModels] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // 🔹 Fetch car brands on mount
    useEffect(() => {
        fetchCarBrands().then((data) => {
            setBrands(data);
            setLoadingBrands(false);
        });
    }, []);

    // 🔹 Fetch models when the brand changes
    useEffect(() => {
        if (marca) {
            setLoadingModels(true);
            fetchCarModels(marca.value).then((data) => {
                setModels(data);
                setLoadingModels(false);
            });
        } else {
            setModels([]);
        }
    }, [marca]);

    // 🔹 Validate form before submitting
    const validateForm = () => {
        let errors: { [key: string]: string } = {};
        if (!marca) errors.marca = "Alege o marcă!";
        if (!model) errors.model = "Alege un model!";
        if (!an) errors.an = "Selectează anul!";
        if (pret === "" || Number(pret) <= 0) errors.pret = "Preț invalid!";
        return errors;
    };

    // 🔹 Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        setSuccessMessage("");

        const success = await addCar({
            marca: marca?.value || "",
            model: model?.value || "",
            an: an?.value || "",
            pret: Number(pret),
        });

        setSubmitting(false);

        if (success) {
            setSuccessMessage("🚗 Mașina a fost adăugată cu succes!");
            setMarca(null);
            setModel(null);
            setAn(null);
            setPret("");
            onCarAdded(); // 🔄 Refresh list

            // 🔹 Hide success message after 3 seconds
            setTimeout(() => setSuccessMessage(""), 3000);
        } else {
            alert("❌ Eroare la adăugarea mașinii!");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg animate-fade-in">
            <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">Adaugă o mașină</h2>

            {/* 🔹 Show loading spinner while fetching brands */}
            {loadingBrands ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 🔹 Success Message */}
                    {successMessage && (
                        <div className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md">
                            <FaCheckCircle className="mr-2" /> {successMessage}
                        </div>
                    )}

                    {/* Select Marca */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Marca</label>
                        <Select
                            options={brands}
                            placeholder="Selectează marca"
                            value={marca}
                            onChange={(selectedOption) => {
                                setMarca(selectedOption);
                                setModel(null);
                            }}
                            className="text-gray-900"
                        />
                    </div>

                    {/* Select Model with Loader */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Model</label>
                        {loadingModels ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>
                            </div>
                        ) : (
                            <Select
                                options={models}
                                placeholder="Selectează modelul"
                                value={model}
                                onChange={setModel}
                                isDisabled={!marca}
                                className="text-gray-900"
                            />
                        )}
                    </div>

                    {/* Select An */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">An</label>
                        <Select
                            options={years}
                            placeholder="Selectează anul"
                            value={an}
                            onChange={setAn}
                            className="text-gray-900"
                        />
                    </div>

                    {/* Input Preț */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Preț (€)</label>
                        <input
                            type="number"
                            placeholder="Preț (€)"
                            value={pret}
                            onChange={(e) => setPret(Math.max(0, Number(e.target.value)))}
                            className="w-full p-2 border rounded text-gray-900 bg-white"
                            required
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center justify-center gap-2 py-2 px-6 rounded-lg shadow-md transition duration-300 w-full ${
                            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        {submitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-white"></div>
                        ) : (
                            <>
                                <FaPlus /> Adaugă
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddCar;
