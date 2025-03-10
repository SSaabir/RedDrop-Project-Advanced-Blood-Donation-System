import { useState, useEffect } from "react";

export const useDonor = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Create a new donor with image upload
    const createDonor = async(donorData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            for (const key in donorData) {
                formData.append(key, donorData[key]);
            }

            const response = await fetch("/api/donor", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create donor");
            }

            const newDonor = await response.json();
            setDonors((prev) => [...prev, newDonor]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch all donors
    const fetchDonors = async() => {
        setLoading(true);
        try {
            const response = await fetch("/api/donor");
            if (!response.ok) throw new Error("Failed to fetch donors");
            const data = await response.json();
            setDonors(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    return {
        donors,
        createDonor,
        fetchDonors,
        loading,
        error,
    };
};