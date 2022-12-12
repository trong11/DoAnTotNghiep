import axiosClient from "./axiosClient";

export const category = {
    movie: 'movie',
    tv: 'tv'
}

export const movieType = {
    upcoming: 'upcoming',
    popular: 'popular',
    top_rated: 'top_rated'
}

export const tvType = {
    popular: 'popular',
    top_rated: 'top_rated',
    on_the_air: 'on_the_air'
}

const tmdbApi = {
    searchMovie: (params) => {
        const url = 'search/movie/';
        return axiosClient.get(url, params);
    },
    searchTv: (params) => {
        const url = 'search/tv/';
        return axiosClient.get(url, params);
    },
    movieImages: (params,movieId) => {
        const url = 'movie/' + movieId + '/images';
        return axiosClient.get(url, params);
    },
    tvImages: (params,movieId) => {
        const url = 'tv/' + movieId + '/images';
        return axiosClient.get(url, params);
    },
    movieVideos: (params,movieId) => {
        const url = 'movie/' + movieId + '/videos';
        return axiosClient.get(url, params);
    },
    tvVideos: (params,movieId) => {
        const url = 'tv/' + movieId + '/videos';
        return axiosClient.get(url, params);
    },
    movieProviders: (params,movieId) => {
        const url = 'movie/' + movieId + '/watch/providers';
        return axiosClient.get(url, params);
    },
    tvProviders: (params,movieId) => {
        const url = 'tv/' + movieId + '/watch/providers';
        return axiosClient.get(url, params);
    },
}

export default tmdbApi;