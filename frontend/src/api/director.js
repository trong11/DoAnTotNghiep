import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createDirector = async (formData) => {
    const token = getToken();
    try {
        const { data } = await client.post("/director/create", formData, {
            headers: {
                authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const searchDirector = async (query) => {
    const token = getToken();
    try {
        const { data } = await client(`/director/search?name=${query}`, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getDirectors = async (pageNo, limit) => {
    const token = getToken();
    try {
        const { data } = await client(`/director/directors?pageNo=${pageNo}&limit=${limit}`, {
            headers: {
                authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const updateDirector = async (id, formData) => {
    const token = getToken();
    try {
        const { data } = await client.post("/director/update/"+ id, formData, {
            headers: {
                authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const deleteDirector = async (id) => {
    const token = getToken();
    try {
        const { data } = await client.delete("/director/" + id, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};



