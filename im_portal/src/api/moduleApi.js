import axios from "axios";

const BASE_URL = "http://localhost:8080";

/**
 * Fetch all available modules from the database.
 */
export const getModules = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/modules`);
        return response.data;
    } catch (error) {
        console.error("Error fetching modules:", error);
        throw error;
    }
};
