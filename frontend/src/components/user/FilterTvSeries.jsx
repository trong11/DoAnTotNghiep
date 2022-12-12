import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useNotification} from "../../hooks";
import Container from "../Container";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";
import {apiFilterMovies} from "../../api/MovieApi";
import Selector from "../Selector";
import {genreOptions, sortOptions} from "../../utils/options";

const type = 'TV Series';

export default function FilterTvSeries() {
    const [movies, setMovies] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);

    const [searchParams] = useSearchParams();
    const genreQuery = searchParams.get("genre");
    const sortOptionQuery = searchParams.get("sortOption");

    const {updateNotification} = useNotification();

    const [genres, setGenres] = useState("");
    const [sortOption, setSortOption] = useState("");

    const navigate = useNavigate();

    const handleGenreChange = ({target}) => {
        const {value, name} = target;
        setGenres(value);
    }

    const handleSortOptionChange = ({target}) => {
        const {value, name} = target;
        setSortOption(value);
    }

    useEffect(() => {
        console.log(genres);
        // const newMovies = movies.filter(function (movie){
        //     return movie.genres.includes(genres);
        // })
        // setMovies([...newMovies]);
        if (genres.trim() !== "") navigate('/tv/filter?genre=' + genres);
    }, [genres])

    useEffect(() => {
        console.log(sortOption);
        if (sortOption === "Most Reviewed") {
            const sortedMovies = movies.sort(function (a, b) {
                return b.reviews.reviewCount - a.reviews.reviewCount;
            })
            setMovies([...sortedMovies]);
        } else if (sortOption === "Highest Rated") {
            const sortedMovies = movies.sort(function (a, b) {
                return b.reviews.ratingAvg - a.reviews.ratingAvg;
            })
            setMovies([...sortedMovies]);
        }
        else if (sortOption === "Newest") {
            const sortedMovies = movies.sort(function (a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt)
            })
            setMovies([...sortedMovies]);
        }
    }, [sortOption])

    const filterMovies = async (val1, val2) => {
        const {error, movies} = await apiFilterMovies(val1, val2);
        if (error) return updateNotification("error", error);

        if (!movies.length) {
            setResultNotFound(true);
            return setMovies([]);
        }

        // results.sort(function (a, b){
        //     return a.reviews.ratingAvg - b.reviews.ratingAvg;
        // })
        //
        // console.log(results);

        setResultNotFound(false);
        setMovies([...movies]);
    };

    useEffect(() => {
        setGenres(genreQuery);
        if (genreQuery.trim()) filterMovies(genreQuery, type);
    }, [genreQuery]);

    return (
        <div className="dark:bg-primary bg-white min-h-screen">
            <Container className="px-2 xl:p-0">
                <div className="pt-5 pb-5 space-x-3">
                    <Selector
                        onChange={handleGenreChange}
                        name="genres"
                        value={genres}
                        options={genreOptions}
                        label="Genres"
                    />
                    <Selector
                        onChange={handleSortOptionChange}
                        name="sortOption"
                        value={sortOption}
                        options={sortOptions}
                        label="Sort"
                    />
                </div>
                <NotFoundText text="Record not found!" visible={resultNotFound}/>
                <MovieList movies={movies}/>
            </Container>
        </div>
    );
}
