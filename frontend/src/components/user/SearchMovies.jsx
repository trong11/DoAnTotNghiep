import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPublicMovies } from "../../api/MovieApi";
import { useNotification } from "../../hooks";
import Container from "../Container";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";

export default function SearchMovies() {
    const [movies, setMovies] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);

    const [searchParams] = useSearchParams();
    const query = searchParams.get("title");

    const { updateNotification } = useNotification();

    const searchMovies = async (val) => {
        const { error, results } = await searchPublicMovies(val);
        if (error) return updateNotification("error", error);

        if (!results.length) {
            setResultNotFound(true);
            return setMovies([]);
        }

        // results.sort(function (a, b){
        //     return a.reviews.ratingAvg - b.reviews.ratingAvg;
        // })
        //
        // console.log(results);

        setResultNotFound(false);
        setMovies([...results]);
    };

    useEffect(() => {
        if (query.trim()) searchMovies(query);
    }, [query]);

    return (
        <div className="dark:bg-primary bg-white min-h-screen py-8">
            <Container className="px-2 xl:p-0">
                <NotFoundText text="Record not found!" visible={resultNotFound} />
                <MovieList movies={movies} />
            </Container>
        </div>
    );
}
