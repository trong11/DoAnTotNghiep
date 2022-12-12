import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth, useNotification} from "../../hooks";
import {getSingleMovie} from "../../api/MovieApi";
import tmdbApi from "../../api/tmdbApi";
import Container from "../Container";
import apiConfig from "../../api/apiConfig";
import GridContainer from "../GridContainer";

export default function Videos() {
    const {movieId} = useParams();
    const {updateNotification} = useNotification();
    const navigate = useNavigate();

    const [ready, setReady] = useState(false);
    const [movie, setMovie] = useState({});
    const [searchMovie, setSearchMovie] = useState([]);
    const [movieVideos, setMovieVideos] = useState([]);

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
            const getVideos = async () => {
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
                    const response = await tmdbApi.movieVideos({params}, idd);
                    setMovieVideos(response.results);
                } catch {
                    console.log('error');
                }
            }
            getVideos();
        } else {
            const getVideos = async () => {
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
                    const response = await tmdbApi.tvVideos({params}, idd);
                    setMovieVideos(response.results);
                } catch {
                    console.log('error');
                }
            }
            getVideos();
        }
    }, [searchMovie])

    useEffect(() => {
        console.log(movieVideos);
    }, [movieVideos])

    return (
        <Container>
            <div className="w-full bg-gray-300 h-55 flex flex-row">
                <img
                    className="w-50 h-20 p-2"
                    src={movie.poster}
                    alt={movie.title}
                />
                <h1 className="font-semibold p-2 text-xl"> Videos from {movie.title} </h1>
            </div>
            <div className="flex flex-col">
                <>
                    {
                        movieVideos.map((item, i) => (
                            <div className="flex flex-row py-3 overflow-auto rounded-lg shadow">
                                <Video key={i} item={item}/>
                                <div className="flex flex-col pl-4">
                                    <h1 className="font-semibold text-lg">{item.name}</h1>
                                    <h1> {item.type}</h1>
                                    <h1> Publish date: {new Date(item.published_at).getDate() + " " + new Date(item.published_at).toLocaleString('default', {month: 'long'}) +
                                        " " + new Date(item.published_at).getFullYear()} </h1>
                                </div>
                            </div>
                        ))
                    }
                </>
            </div>
        </Container>
    );
}

const Video = props => {

    const item = props.item;

    const iframeRef = useRef(null);

    useEffect(() => {
        const height = iframeRef.current.offsetWidth * 9 / 16 + 'px';
        iframeRef.current.setAttribute('height', height);
    }, []);

    return (
        <div className="video">
            <iframe
                src={`https://www.youtube.com/embed/${item.key}`}
                ref={iframeRef}
                width="100%"
                title="video"
            ></iframe>
        </div>
    )
}
