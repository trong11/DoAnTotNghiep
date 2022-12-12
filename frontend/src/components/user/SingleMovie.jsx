import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getSingleMovie} from "../../api/MovieApi";
import {useAuth, useNotification} from "../../hooks";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import AddRatingModal from "../models/AddRatingModal";
import ProfileModal from "../models/ProfileModal";
import RelatedMovies from "../RelatedMovies";
import RatingForm from "../form/RatingForm";
import {addReview} from "../../api/review";
import tmdbApi from "../../api/tmdbApi";
import GridContainer from "../GridContainer";
import apiConfig from "../../api/apiConfig";
import {AiFillStar} from "react-icons/ai";

const convertReviewCount = (count = 0) => {
    if (count <= 999) return count;

    return parseFloat(count / 1000).toFixed(2) + "k";
};

const convertDate = (date = "") => {
    return date.split("T")[0];
};

export default function SingleMovie() {
    const [ready, setReady] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [movie, setMovie] = useState({});
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState({});
    const [searchMovie, setSearchMovie] = useState([]);
    const [movieImages, setMovieImages] = useState([]);
    const [movieVideos, setMovieVideos] = useState([]);
    const [movieProviders, setMovieProviders] = useState([]);


    const {movieId} = useParams();
    const {updateNotification} = useNotification();
    const {authInfo} = useAuth();
    const {isLoggedIn} = authInfo;
    const navigate = useNavigate();

    const fetchMovie = async () => {
        const {error, movie} = await getSingleMovie(movieId);
        if (error) return updateNotification("error", error);

        setReady(true);
        setMovie(movie);
    };

    const hideRatingModal = () => {
        setShowRatingModal(false);
    };

    const handleProfileClick = (profile) => {
        setSelectedProfile(profile);
        setShowProfileModal(true);
    };

    const hideProfileModal = () => {
        setShowProfileModal(false);
    };

    const handleOnRatingSuccess = (reviews) => {
        setMovie({...movie, reviews: {...reviews}});
    };

    const handleAddReviewSubmit = async (data) => {
        const {error, message, reviews} = await addReview(movieId, data);
        if (error) return updateNotification("error", error);

        updateNotification("success", message);
        handleOnRatingSuccess(reviews);
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
                    setMovieImages(response.backdrops.slice(1, 6));
                } catch {
                    console.log('error');
                }
            }
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
                    setMovieVideos(response.results.slice(1, 3));
                } catch {
                    console.log('error');
                }
            }
            const getProviders = async () => {
                const params = {
                    api_key: '9f2a3988c718c8c5d0b1ff4058098104'
                }
                try {
                    searchMovie.sort((a, b) => {
                        return b.popularity - a.popularity;
                    })
                    const idd = searchMovie[0].id;
                    const response = await tmdbApi.movieProviders({params}, idd);
                    setMovieProviders(response.results.US.flatrate);
                } catch {
                    console.log('error');
                }
            }
            getImages();
            getVideos();
            getProviders();
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
                    setMovieImages(response.backdrops.slice(1, 6));
                } catch {
                    console.log('error');
                }
            }
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
                    setMovieVideos(response.results.slice(1, 3));
                } catch {
                    console.log('error');
                }
            }
            const getProviders = async () => {
                const params = {
                    api_key: '9f2a3988c718c8c5d0b1ff4058098104'
                }
                try {
                    searchMovie.sort((a, b) => {
                        return b.popularity - a.popularity;
                    })
                    const idd = searchMovie[0].id;
                    const response = await tmdbApi.tvProviders({params}, idd);
                    setMovieProviders(response.results.US.flatrate);
                } catch {
                    console.log('error');
                }
            }
            getImages();
            getVideos();
            getProviders();
        }
    }, [searchMovie])

    useEffect(() => {
        console.log(movieImages);
    }, [movieImages])

    useEffect(() => {
        console.log(movieVideos);
    }, [movieVideos])

    useEffect(() => {
        console.log(movieProviders);
    }, [movieProviders])

    if (!ready)
        return (
            <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
                <p className="text-light-subtle dark:text-dark-subtle animate-pulse">
                    Please wait
                </p>
            </div>
        );

    const {
        id,
        trailer,
        poster,
        title,
        storyLine,
        language,
        releaseDate,
        type,
        director = {},
        reviews = {},
        writers = [],
        cast = [],
        genres = [],
    } = movie;

    return (
        <div className="dark:bg-primary bg-white min-h-screen pb-10">
            <Container className="xl:px-0 px-2">
                <video className="w-full pb-3" poster={poster} controls src={trailer}></video>
                <div className="w-full bg-gray-200">
                    <div className="flex justify-center">
                        <h1 className="xl:text-4xl lg:text-3xl text-2xl text-black  font-semibold py-3">
                            {title}
                        </h1>
                    </div>
                    <div className="flex justify-center">
                        <p className="text-yellow-500 flex items-center text-2xl space-x-1">
                            <span>{reviews.ratingAvg}</span>
                            <AiFillStar/>
                        </p>
                        <Link to = {"/movie/reviews/" + id}>
                            <h1 className="text-2xl pl-5"> {reviews.reviewCount} Reviews</h1>
                        </Link>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>
                    <ListWithLabel label="Director:">
                        <CustomButtonLink
                            // onClick={() => handleProfileClick(director)}
                            label={director.name}
                        />
                    </ListWithLabel>

                    <ListWithLabel label="Writers:">
                        {writers.map((w) => (
                            <CustomButtonLink
                                // onClick={() => handleProfileClick(w)}
                                key={w.id}
                                label={w.name}
                            />
                        ))}
                    </ListWithLabel>

                    <ListWithLabel label="Language:">
                        <CustomButtonLink label={language} clickable={false}/>
                    </ListWithLabel>

                    <ListWithLabel label="Release Date:">
                        <CustomButtonLink
                            label={convertDate(releaseDate)}
                            clickable={false}
                        />
                    </ListWithLabel>

                    <ListWithLabel label="Genres:">
                        {genres.map((g) => (
                            <CustomButtonLink label={g} key={g} clickable={false}/>
                        ))}
                    </ListWithLabel>

                    <ListWithLabel label="Type:">
                        <CustomButtonLink label={type} clickable={false}/>
                    </ListWithLabel>

                    <CastProfiles cast={cast}/>
                    <Providers providers={movieProviders}/>
                    <div className="flex flex-row justify-between">
                        <h1 className="text-black font-semibold text-2xl mb-2 pt-3">
                            Images
                        </h1>
                        <Link className="pt-5" to={"/movie/images/" + movie.id}>
                            <h1 className="hover:underline">View all</h1>
                        </Link>
                    </div>
                    <GridContainer>
                        {movieImages.map((image) => {
                            return <div>
                                <img
                                    className="aspect-video object-cover w-full"
                                    src={apiConfig.originalImage(image.file_path)}
                                />
                            </div>
                        })}
                    </GridContainer>
                    <div className="flex flex-row justify-between">
                        <h1 className="text-black font-semibold text-2xl mb-2 pt-3">
                            Videos
                        </h1>
                        <Link className="pt-5" to={"/movie/videos/" + movie.id}>
                            <h1 className="hover:underline">View all</h1>
                        </Link>
                    </div>
                    <GridContainer>
                        <>
                            {
                                movieVideos.map((item, i) => (
                                    <Video key={i} item={item}/>
                                ))
                            }
                        </>
                    </GridContainer>

                    {isLoggedIn ?
                        <div>
                            <h1 className="text-black font-semibold text-2xl mb-2 pt-3">
                                Rate and Review
                            </h1>
                            < RatingForm onSubmit={handleAddReviewSubmit}/></div> : null
                    }
                    <RelatedMovies movieId={movieId}/>
                </div>
            </Container>

            <ProfileModal
                visible={showProfileModal}
                onClose={hideProfileModal}
                profileId={selectedProfile.id}
            />

            <AddRatingModal
                visible={showRatingModal}
                onClose={hideRatingModal}
                onSuccess={handleOnRatingSuccess}
            />
        </div>
    );
}

const ListWithLabel = ({children, label}) => {
    return (
        <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
                {label}
            </p>
            {children}
        </div>
    );
};

const CastProfiles = ({cast, onProfileClick}) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState({});


    const handleProfileClick = (profile) => {
        setSelectedProfile(profile);
        setShowProfileModal(true);
    };

    const hideProfileModal = () => {
        setShowProfileModal(false);
    };
    return (
        <div className="">
            <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
                Cast:
            </h1>
            <div className="flex flex-wrap space-x-4">
                {cast.map(({id, profile, roleAs}) => {
                    return (
                        <div
                            key={id}
                            className="basis-28 flex flex-col items-center text-center mb-4"
                        >
                            <img
                                className="w-24 h-24 aspect-square object-cover rounded-full"
                                src={profile.avatar}
                                alt=""
                            />

                            <Link to={"/actor/" + profile.id}>
                                <h1> {profile.name} </h1>
                            </Link>
                            <span className="text-light-subtle dark:text-dark-subtle text-sm">
                as
              </span>
                            <p className="text-light-subtle dark:text-dark-subtle">
                                {roleAs}
                            </p>
                        </div>
                    );
                })}
            </div>
            <ProfileModal
                visible={showProfileModal}
                onClose={hideProfileModal}
                profileId={selectedProfile.id}
            />
        </div>
    );
};

const Providers = ({providers}) => {
    return (
        <div className="">
            <h1 className="text-black font-semibold text-2xl mb-2">
                Where to watch
            </h1>
            <div className="flex flex-wrap space-x-4">
                {providers ? providers.map((provider) => {
                    return (
                        <div
                            className="basis-28 flex flex-col items-center text-center mb-4"
                        >
                            <img
                                className="w-24 h-24 aspect-square object-cover rounded-full"
                                src={apiConfig.originalImage(provider.logo_path)}
                                alt=""
                            />
                            <CustomButtonLink label={provider.provider_name}/>
                        </div>
                    );
                }): <h1 className="font-semibold text-xl text-light-subtle"> Only in Theater </h1>}
            </div>
        </div>
    );
};

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

