import React, { useState, useEffect, useRef, forwardRef } from "react";
import { getLatestUploads } from "../../api/MovieApi";
import { useNotification } from "../../hooks";
import leftArrow from "../icons/left-arrow.svg";
import rightArrow from "../icons/right-arrow.svg";
import '../../css/Slider.css'

export default function HeroSlidShow() {

    const [movies, setMovies] = useState([]);
    const [movie, setMovie] = useState({});

    const { updateNotification } = useNotification();

    const [slideIndex, setSlideIndex] = useState(1)

    const nextSlide = () => {
        if(slideIndex !== movies.length){
            setSlideIndex(slideIndex + 1)
        }
        else if (slideIndex === movies.length){
            setSlideIndex(1)
        }
    }

    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(movies.length)
        }
    }

    const moveDot = index => {
        setSlideIndex(index)
    }

    const fetchLatestUploads = async (signal) => {
        const { error, movies } = await getLatestUploads(signal);
        if (error) return updateNotification("error", error);

        setMovies(movies);
        const movie1 = movies[Math.floor(Math.random() * movies.length)];
        setMovie(movie1);

        // setSlides([...movies]);
        // setCurrentSlide(movies[0]);
    };

    useEffect(() => {
        fetchLatestUploads();
    }, []);


    return (
        <div className="container-slider" >
            <div className='absolute w-full h-[600px] bg-gradient-to-r from-black'></div>
            {movies.map((m, index) => {
                return (
                    <div
                        key={m.id}
                        className={slideIndex === index + 1 ? "slide active-anim" : "slide"}
                    >
                        <img
                            src={m.poster}
                        />
                        <div className='absolute w-full top-[20%] p-4 md:p-8'>
                            <h1 className='text-3xl md:text-5xl font-bold text-white'>{m.title}</h1>
                            <div className='my-4'>
                                <button className='border bg-gray-300 text-black border-gray-300 py-2 px-5'>
                                    View
                                </button>
                            </div>
                            <p className='text-gray-400 text-sm'>
                                Released: {m.releaseDate}
                            </p>
                            <p className='w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200'>
                                {m.storyLine}
                            </p>
                        </div>
                    </div>
                )
            })}
            <BtnSlider moveSlide={nextSlide} direction={"next"} />
            <BtnSlider moveSlide={prevSlide} direction={"prev"}/>

            <div className="container-dots">
                {Array.from({length: 5}).map((item, index) => (
                    <div
                        onClick={() => moveDot(index + 1)}
                        className={slideIndex === index + 1 ? "dot active" : "dot"}
                    ></div>
                ))}
            </div>
        </div>
    );
}

const BtnSlider = ({ direction, moveSlide }) => {
    return (
        <button
            onClick={moveSlide}
            className={direction === "next" ? "btn-slide next" : "btn-slide prev"}
        >
            <img src={direction === "next" ? rightArrow : leftArrow} />
        </button>
    );
}


