const API_CARS_URL = "http://localhost:8080/cars"; // 🔹 Endpoint principal pentru backend

// 🔹 Obține toate mașinile din backend
export const fetchCars = async () => {
    try {
        const response = await fetch(API_CARS_URL);
        if (!response.ok) throw new Error("Eroare la preluarea mașinilor!");
        return await response.json();
    } catch (error) {
        console.error("❌ Eroare la fetchCars:", error);
        return [];
    }
};

// 🔹 Adaugă o mașină nouă
export const addCar = async (car: { marca: string; model: string; an: string; pret: number }) => {
    try {
        const response = await fetch(API_CARS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(car),
        });
        if (!response.ok) throw new Error("Eroare la adăugarea mașinii!");
        return true;
    } catch (error) {
        console.error("❌ Eroare la addCar:", error);
        return false;
    }
};

// 🔹 Șterge o mașină după ID
export const deleteCarById = async (id: number) => {
    try {
        const response = await fetch(`${API_CARS_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Eroare la ștergerea mașinii!");
        console.log(`✅ Mașina cu ID ${id} a fost ștearsă.`);
        return true;
    } catch (error) {
        console.error(`❌ Eroare la ștergerea mașinii cu ID ${id}:`, error);
        return false;
    }
};

// 🔹 API-ul extern pentru mărci și modele
const CAR_BRANDS_API = "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json";
const CAR_MODELS_API = (brand: string) => `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${brand}?format=json`;

// 🔹 Fetch și sortare pentru mărci
export const fetchCarBrands = async () => {
    try {
        const response = await fetch(CAR_BRANDS_API);
        const data = await response.json();

        if (!data.Results || data.Results.length === 0) {
            console.warn("⚠️ API-ul nu a returnat nicio marcă!");
            return [];
        }

        // 🔹 Verificăm că fiecare marcă are un nume valid și eliminăm valorile null
        const validBrands = data.Results
            .filter((brand: any) => brand.MakeName && typeof brand.MakeName === "string")
            .map((brand: any) => ({
                value: brand.MakeName.trim(), // Elimină spațiile extra
                label: brand.MakeName.trim()
            }))
            .sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label)); // Sortează alfabetic

        console.log("✅ Mărci procesate:", validBrands);
        return validBrands;
    } catch (error) {
        console.error("❌ Eroare la încărcarea mărcilor:", error);
        return [];
    }
};

// 🔹 Fetch și sortare pentru modele
export const fetchCarModels = async (brand: string) => {
    try {
        const response = await fetch(CAR_MODELS_API(brand));
        const data = await response.json();

        if (!data.Results || data.Results.length === 0) {
            console.warn(`⚠️ API-ul nu a returnat modele pentru marca: ${brand}`);
            return [];
        }

        // 🔹 Verificăm că fiecare model are un nume valid și eliminăm valorile null
        const validModels = data.Results
            .filter((model: any) => model.Model_Name && typeof model.Model_Name === "string")
            .map((model: any) => ({
                value: model.Model_Name.trim(),
                label: model.Model_Name.trim(),
            }))
            .sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));

        console.log(`✅ Modele pentru ${brand}:`, validModels);
        return validModels;
    } catch (error) {
        console.error("❌ Eroare la încărcarea modelelor:", error);
        return [];
    }
};
