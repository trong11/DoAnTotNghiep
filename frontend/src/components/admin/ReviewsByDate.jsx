import React, {useEffect, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {getSingleMovie} from "../../api/MovieApi";
import {getReviewsByDate} from "../../api/review";
import {BsPencilSquare, BsTrash} from "react-icons/bs";

export default function ReviewsByDate() {
    const {movieId} = useParams();

    const [searchParams] = useSearchParams();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const [reviews, setReviews] = useState([])
    const [showOptions, setShowOptions] = useState(false);

    const fetchReviews = async () =>{
        const {reviews} = await getReviewsByDate(movieId, startDate, endDate);
        setReviews(reviews)
    }

    useEffect(() => {
        if (movieId) fetchReviews();
    }, [reviews]);

    return (
        <div className="grid grid-cols-1 gap-5 p-5">
            {reviews.map((review)=>(
                <div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden">
                    <div
                        className="flex cursor-pointer relative"
                    >
                        <div className="px-2">
                            <h1 className="text-xl text-primary dark:text-white font-semibold whitespace-nowrap">
                                {review.owner.name}
                            </h1>
                            <p className="text-primary dark:text-white opacity-70">
                                {review.content}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
    ;
}



