import React, {useEffect, useState} from "react";
import Container from "../Container";
import {getReviewsByUser} from "../../api/review";
import RatingStar from "../RatingStar";
import {Link, useNavigate} from "react-router-dom";

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    const fetchReviews = async () => {
        const {reviews} = await getReviewsByUser();
        setReviews(reviews.finalReviews);
    }

    useEffect(() => {
        fetchReviews();
    }, [])

    return (
        <Container>
            <h1 className="font-semibold text-4xl text-black text-center py-5 "> My Ratings </h1>
            <div >
                <div className="grid grid-cols-1 gap-5">
                    {
                        reviews.map((review) => (
                            <ReviewsProfile
                                profile={review}
                                key={review.id}
                            />
                        ))
                    }
                </div>
            </div>
        </Container>
    );
}


const ReviewsProfile = ({profile,onClick}) => {
    if (!profile) return null;

    const {rating, content, createdAt, movie} = profile;
    const {title, poster, _id} = movie;

    return (
        <div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-25 overflow-hidden">
            <Link to={"/movie/reviews/"+_id} className="text-xl text-primary font-semibold whitespace-nowrap">
                {title}
            </Link>
            <div
                className="flex cursor-pointer relative"
            >
                <img
                    src={poster}
                    alt={title}
                    className="w-20 h-20 aspect-square object-cover"
                />
                <div className="px-2">
                    <h1 className="text-xl text-primary font-semibold whitespace-nowrap">
                        <RatingStar rating={rating}/>
                    </h1>
                    <h1> Date: {new Date(createdAt).getDate() + " " + new Date(createdAt).toLocaleString('default', {month: 'long'}) +
                        " " + new Date(createdAt).getFullYear()} </h1>
                    <p className="text-primary opacity-70">
                        {content}
                    </p>
                </div>
            </div>
        </div>
    );
};
