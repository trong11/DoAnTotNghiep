import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth, useNotification} from "../../hooks";
import {getSingleMovie} from "../../api/MovieApi";
import tmdbApi from "../../api/tmdbApi";
import Container from "../Container";
import apiConfig from "../../api/apiConfig";
import GridContainer from "../GridContainer";

export default function Images() {
    const {movieId} = useParams();
    const {updateNotification} = useNotification();
    const navigate = useNavigate();

    const [ready, setReady] = useState(false);
    const [movie, setMovie] = useState({});
    const [searchMovie, setSearchMovie] = useState([]);
    const [movieImages, setMovieImages] = useState([]);

    const fetchMovie = async () => {
        const {error, movie} = await getSingleMovie(movieId);
        if (error) return updateNotification("error", error);

        setReady(true);
        setMovie(movie);
    };

    useEffect(() => {
        if (movieId) fetchMovie();
    }, [movieId]);

    useEffect(() => {
        if (movie.type === 'Film') {
            const getMovies = async () => {
                const params = {
                    page: 1,
                    language: 'en-US',
                    query: movie.title,
                    include_adult: true,
                    api_key: '9f2a3988c718c8c5d0b1ff4058098104'
                }
                try {
                    const response = await tmdbApi.searchMovie({params});
                    setSearchMovie(response.results);
                    console.log(response);
                } catch {
                    console.log('error');
                }
            }
            getMovies();
        } else {
            const getMovies = async () => {
                const params = {
                    page: 1,
                    language: 'en-US',
                    query: movie.title,
                    include_adult: true,
                    api_key: '9f2a3988c718c8c5d0b1ff4058098104'
                }
                try {
                    const response = await tmdbApi.searchTv({params});
                    setSearchMovie(response.results);
                    console.log(response);
                } catch {
                    console.log('error');
                }
            }
            getMovies();
        }
    }, [movie])

    useEffect(() => {
        if (movie.type === 'Film') {
            const getImages = async () => {
                const params = {
                    include_image_language: 'en,null',
                    language: 'en-US',
                    api_key: '9f2a3988c718c8c5d0b1ff4058098104'
                }
                try {
                    searchMovie.sort((a, b) => {
                        return b.popularity - a.popularity;
                    })
                    const idd = searchMovie[0].id;
                    const response = await tmdbApi.movieImages({params}, idd);
                    setMovieImages(response.backdrops);
                } catch {
                    console.log('error');
                }
            }
            getImages();
        } else {
            const getImages = async () => {
                const params = {
                    include_image_language: 'en,null',
                    language: 'en-US',
                    api_key: '9f2a3988c718c8c5d0b1ff4058098104'
                }
                try {
                    searchMovie.sort((a, b) => {
                        return b.popularity - a.popularity;
                    })
                    const idd = searchMovie[0].id;
                    const response = await tmdbApi.tvImages({params}, idd);
                    setMovieImages(response.backdrops);
                } catch {
                    console.log('error');
                }
            }
            getImages();
        }
    }, [searchMovie])

    useEffect(() => {
        console.log(movieImages);
    }, [movieImages])

    return (
        <Container>
        <div className="w-full bg-gray-300 h-55 flex flex-row">
            <img
                className="w-50 h-20 p-2"
                src={movie.poster}
                alt={movie.title}
            />
            <h1 className="font-semibold p-2 text-xl"> Images from {movie.title} </h1>
        </div>
            <GridContainer className="pt-1">
                {movieImages.map((image) => {
                    return <div>
                        <img
                            className="aspect-video object-cover w-full"
                            src={apiConfig.originalImage(image.file_path)}
                        />
                    </div>
                })}
            </GridContainer>
        </Container>
    );
}
