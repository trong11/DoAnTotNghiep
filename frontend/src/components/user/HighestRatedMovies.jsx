import React, { useState, useEffect } from "react";

import {getHighestRatedMovies} from "../../api/MovieApi";
import { useNotification } from "../../hooks";
import MovieListHomePage from "./MovieListHomePage";

export default function HighestRatedMovies() {
    const [movies, setMovies] = useState([]);
    const { updateNotification } = useNotification();

    const fetchMovies = async (signal) => {
        const { error, movies } = await getHighestRatedMovies(null,5,"2022-01-01","2022-12-31",signal);
        if (error) return updateNotification("error", error);

        setMovies([...movies]);
    };

    useEffect(() => {
        const ac = new AbortController();

        fetchMovies(ac.signal);
        return () => {
            ac.abort();
        };
    }, []);

    return <MovieListHomePage movies={movies} title="Highest Rated (Movies)" />;
}
