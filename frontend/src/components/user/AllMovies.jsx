import React, {useEffect, useState} from "react";
import Container from "../Container";
import {getMoviesByType, searchPublicMovies} from "../../api/MovieApi";
import {useNotification} from "../../hooks";
import MovieList from "./MovieList";
import NextAndPrevButton from "../NextAndPrevButton";
import Selector from "../Selector";
import {genreOptions, sortOptions, typeOptions} from "../../utils/options";
import {useNavigate} from "react-router-dom";

const limit = 10;
let currentPageNo = 0;
const type = 'Film';

export default function AllMovies() {
    const [movies, setMovies] = useState([]);

    const {updateNotification} = useNotification();
    const [reachedToEnd, setReachedToEnd] = useState(false);

    const fetchMovies = async (pageNo = currentPageNo) => {
        const {error, movies} = await getMoviesByType(pageNo, limit, type);
        if (error) return updateNotification("error", error);

        if (!movies.length) {
            currentPageNo = pageNo - 1;
            return setReachedToEnd(true);
        }
        console.log(movies);
        setMovies([...movies]);
    };

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


    const fetchNextPage = () => {
        if (reachedToEnd) return;
        currentPageNo += 1;
        fetchMovies(currentPageNo);
    };

    const fetchPrevPage = () => {
        if (currentPageNo <= 0) return;
        if (reachedToEnd) setReachedToEnd(false);

        currentPageNo -= 1;
        fetchMovies(currentPageNo);
    };

    useEffect(() => {
        fetchMovies(currentPageNo);
    }, []);

    useEffect(() => {
        if (genres.trim() !== "") navigate('/movie/filter?genre=' + genres);
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

    return (
        <div className="dark:bg-primary bg-white min-h-screen ">
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
                <MovieList movies={movies}/>
                <NextAndPrevButton
                    className="mt-5"
                    onNextClick={fetchNextPage}
                    onPrevClick={fetchPrevPage}
                />
            </Container>
        </div>
    )
}
