import {catchError, getToken} from "../utils/helper";
import client from "./client";

export const addReview = async (movieId, reviewData) => {
    const token = getToken();
    try {
        const { data } = await client.post(`/review/add/${movieId}`, reviewData,{
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getReviewByMovie = async (movieId) => {
    const token = getToken();
    try {
        const { data } = await client(`/review/get-reviews-by-movie/${movieId}`);
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const deleteReview = async (reviewId) => {
    const token = getToken();
    try {
        const { data } = await client.delete(`/review/${reviewId}`, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const updateReview = async (reviewId, reviewData) => {
    const token = getToken();
    try {
        const { data } = await client.patch(`/review/${reviewId}`, reviewData, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
};

export const getReviewsByUser = async () => {
    const token = getToken();
    try {
        const { data } = await client.get(`/review/get-reviews-by-user/`, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
}

export const getReviewsByDate = async (movieId, startDate, endDate) => {
    const token = getToken();
    try {
        const { data } = await client.get(`/review/get-reviews-by-date/${movieId}?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
}