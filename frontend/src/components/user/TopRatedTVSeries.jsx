import React, { useState, useEffect } from "react";

import { getTopRatedMovies } from "../../api/MovieApi";
import { useNotification } from "../../hooks";
import GridContainer from "../GridContainer";
import MovieList from "./MovieList";
import MovieListHomePage from "./MovieListHomePage";

export default function TopRatedTVSeries() {
    const [movies, setMovies] = useState([]);
    const { updateNotification } = useNotification();

    const fetchMovies = async (signal) => {
        const { error, movies } = await getTopRatedMovies("TV Series",5,"2022-01-01","2022-12-31", signal);
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

    return <MovieListHomePage movies={movies} title="Most reviewed (TV Series)" />;
}

