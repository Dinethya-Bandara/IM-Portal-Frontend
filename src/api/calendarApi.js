import axios from "axios";

const BASE_URL = "http://localhost:8080";

/**
 * Fetch all calendar events (academic and event) from the backend.
 */
export const getAllEvents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/calendar`);
        return response.data;
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        throw error;
    }
};

/**
 * Add a new calendar event.
 */
export const createEvent = async (eventData) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/calendar`, eventData);
        return response.data;
    } catch (error) {
        console.error("Error creating calendar event:", error);
        throw error;
    }
};

/**
 * Delete a calendar event by ID.
 */
export const removeEvent = async (eventId) => {
    try {
        await axios.delete(`${BASE_URL}/api/calendar/${eventId}`);
    } catch (error) {
        console.error("Error deleting calendar event:", error);
        throw error;
    }
};
