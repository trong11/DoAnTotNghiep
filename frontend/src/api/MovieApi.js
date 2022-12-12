import client from "./client";
import {catchError, getToken} from "../utils/helper";
import axios from "axios";

export const uploadTrailer = async (formData, onUploadProgress) => {
    const token = localStorage.getItem("auth-token");
    try {
        const { data } = await client.post("/movie/upload-trailer", formData, {
            headers: {
                authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: ({loaded, total}) => {
                 if(onUploadProgress) onUploadProgress(Math.floor(loaded / total) * 100);
            }
        });
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;

        return { error: error.message || error };
    }
};

export const uploadMovie = async (formData) => {
    const token = getToken();
    try {
        const { data } = await client.post("/movie/create", formData, {
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

export const getMovies = async (pageNo, limit) => {
    const token = getToken();
    try {
        const { data } = await client(`/movie/movies?pageNo=${pageNo}&limit=${limit}`, {
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

export const getMovieForUpdate = async (id) => {
    const token = getToken();
    try {
        const { data } = await client.get("/movie/for-update/"+id,{
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const updateMovie = async (id, formData) => {
    const token = getToken();
    try {
        const { data } = await client.patch("/movie/update/"+id, formData,{
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

export const deleteMovie = async (id) => {
    const token = getToken();
    try {
        const { data } = await client.delete(`/movie/${id}`,{
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const searchMovieForAdmin = async (title) => {
    const token = getToken();
    try {
        const { data } = await client.get(`/movie/search?title=${title}`,{
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getTopRatedMovies = async (type,limit, startDate, endDate ,signal) => {
    try {
        let endpoint = `/movie/top-rated?limit=${limit}&startDate=${startDate}&endDate=${endDate}`;
        if (type) endpoint = endpoint + "&type=" + type;

        const { data } = await client(endpoint, {signal});
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getLatestUploads = async () => {
    try {
        const { data } = await client("/movie/latest-uploads");
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getSingleMovie = async (id) => {
    try {
        const { data } = await client("/movie/single/"+ id);
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getRelatedMovies = async (id) => {
    try {
        const { data } = await client("/movie/related/" + id);
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const searchPublicMovies = async (title) => {
    try {
        const { data } = await client("/movie/search-public?title=" + title);
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getMoviesByType = async (pageNo, limit, type) => {
    const token = getToken();
    try {
        const { data } = await client(`/movie/movies-by-type?pageNo=${pageNo}&limit=${limit}&type=${type}`);
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getHighestRatedMovies = async (type, limit, startDate, endDate, signal) => {
    try {
        let endpoint = `/movie/highest-rated?limit=${limit}&startDate=${startDate}&endDate=${endDate}`;
        if (type) endpoint = endpoint + "&type=" + type;

        const { data } = await client(endpoint, {signal});
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const apiFilterMovies = async (genre, type) => {
    try {
        const { data } = await client(`/movie/movies-filter?genre=${genre}&type=${type}`);
        return data;
    } catch (error) {
        return catchError(error);
    }
};



