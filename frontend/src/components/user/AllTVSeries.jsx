import React, {useEffect, useState} from "react";
import Container from "../Container";
import {getMoviesByType, searchPublicMovies} from "../../api/MovieApi";
import {useNotification} from "../../hooks";
import MovieList from "./MovieList";
import NextAndPrevButton from "../NextAndPrevButton";
import Selector from "../Selector";
import {genreOptions, sortOptions} from "../../utils/options";
import {useNavigate} from "react-router-dom";

const limit = 10;
let currentPageNo = 0;
const type = 'TV Series';

export default function AllTVSeries() {
    const [tv, setTv] = useState([]);

    const { updateNotification } = useNotification();
    const [reachedToEnd, setReachedToEnd] = useState(false);

    const [genres, setGenres] = useState("");
    const [sortOption, setSortOption] = useState("");

    const navigate = useNavigate();

    const fetchMovies = async (pageNo = currentPageNo) => {
        const { error, movies } = await getMoviesByType(pageNo, limit, type);
        if (error) return updateNotification("error", error);

        if (!movies.length) {
            currentPageNo = pageNo - 1;
            return setReachedToEnd(true);
        }
        setTv([...movies]);
    };


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
        if (genres.trim() !== "") navigate('/tv/filter?genre=' + genres);
    }, [genres])

    useEffect(() => {
        console.log(sortOption);
        if (sortOption === "Most Reviewed") {
            const sortedMovies = tv.sort(function (a, b) {
                return b.reviews.reviewCount - a.reviews.reviewCount;
            })
            setTv([...sortedMovies]);
        } else if (sortOption === "Highest Rated") {
            const sortedMovies = tv.sort(function (a, b) {
                return b.reviews.ratingAvg - a.reviews.ratingAvg;
            })
            setTv([...sortedMovies]);
        }
        else if (sortOption === "Newest") {
            const sortedMovies = tv.sort(function (a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt)
            })
            setTv([...sortedMovies]);
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
                <MovieList movies={tv} />
                <NextAndPrevButton
                    className="mt-5"
                    onNextClick={fetchNextPage}
                    onPrevClick={fetchPrevPage}
                />
            </Container>
        </div>
    )
}
