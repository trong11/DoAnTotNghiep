import React from "react";
import {AiFillStar} from "react-icons/ai";
import {Link} from "react-router-dom";
import GridContainer from "../GridContainer";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Container, Card, Row, Col } from "react-bootstrap";
import {HomeWrapper} from "../../css/style";

const trimTitle = (text = "") => {
    if (text.length <= 20) return text;
    return text.substring(0, 20) + "..";
};

export default function MovieListHomePage({title, movies = []}) {
    if (!movies.length) return null;

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1
    };

    return (
        <div>
            <h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">
                {title}
            </h1>
            <Container>
                <Slider {...settings}>
                    {movies.map((movie) => {
                        return <ListItem key={movie.id} movie={movie}/>;
                    })}
                </Slider>
            </Container>
        </div>
    );
}

const ListItem = ({movie}) => {
    const {id, title, poster, reviews} = movie;
    return (
        <Link to={"/movie/" + id}>
            <img
                className="aspect-video object-cover w-full hover:transform-cpu"
                src={poster}
                alt={title}
            />
            <h1
                className="text-lg dark:text-white text-secondary font-semibold"
                title={title}
            >
                {trimTitle(title)}
            </h1>
            {reviews?.ratingAvg ? (
                <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
                    <span>{reviews?.ratingAvg}</span>
                    <AiFillStar/>
                    <h1>/{reviews.reviewCount} reviews</h1>
                </p>
            ) : (
                <p className="text-highlight dark:text-highlight-dark">No reviews</p>
            )}
        </Link>
    );
};

