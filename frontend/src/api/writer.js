import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createWriter = async (formData) => {
    const token = getToken();
    try {
        const { data } = await client.post("/writer/create", formData, {
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

export const searchWriter = async (query) => {
    const token = getToken();
    try {
        const { data } = await client(`/writer/search?name=${query}`, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getWriters = async (pageNo, limit) => {
    const token = getToken();
    try {
        const { data } = await client(`/writer/writers?pageNo=${pageNo}&limit=${limit}`, {
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

export const updateWriter = async (id, formData) => {
    const token = getToken();
    try {
        const { data } = await client.post("/writer/update/"+ id, formData, {
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

export const deleteWriter = async (id) => {
    const token = getToken();
    try {
        const { data } = await client.delete("/writer/" + id, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};



