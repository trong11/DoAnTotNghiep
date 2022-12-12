import React, {useEffect, useState, Component} from "react";
import {useNotification} from "../../hooks";
import {getHighestRatedMovies, getTopRatedMovies} from "../../api/MovieApi";
import {adminSortOptions, sortOptions, typeOptions} from "../../utils/options";
import Selector from "../Selector";
import {commonInputClasses} from "../../utils/theme";
import {Link} from "react-router-dom";

export default function MovieLeaderboard() {
    const [movies, setMovies] = useState([]);
    const {updateNotification} = useNotification();
    const [sortOption, setSortOption] = useState("Highest Rated");
    const [startDate, setStartDate] = useState("2022-01-01");
    const [endDate, setEndDate] = useState("2022-12-31");
    const [type, setType] = useState("Film")

    const fetchTopRatedMovies = async (signal) => {
        const {error, movies} = await getTopRatedMovies(null, 10, startDate, endDate, signal);
        if (error) return updateNotification("error", error);

        setMovies([...movies]);
    };

    const fetchHighestRatedMovies = async (signal) => {
        const {error, movies} = await getHighestRatedMovies(null, 10, startDate, endDate, signal);
        if (error) return updateNotification("error", error);

        setMovies([...movies]);
    };

    const fetchHighestRatedTV = async (signal) => {
        const {error, movies} = await getHighestRatedMovies("TV Series", 5, startDate, endDate, signal);
        if (error) return updateNotification("error", error);

        setMovies([...movies]);
    };

    const fetchTopRatedTV = async (signal) => {
        const {error, movies} = await getTopRatedMovies("TV Series", 5, startDate, endDate, signal);
        if (error) return updateNotification("error", error);

        setMovies([...movies]);
    };

    const handleSortOptionChange = ({target}) => {
        const {value, name} = target;
        setSortOption(value);
    }

    const handleTypeChange = ({target}) => {
        const {value, name} = target;
        setType(value);
    }

    const handleStartDateChange = ({target}) => {
        const {value, name} = target;
        setStartDate(value);
    }

    const handleEndDateChange = ({target}) => {
        const {value, name} = target;
        setEndDate(value);
    }

    useEffect(() => {
        if (sortOption === "Most Reviewed" && type === "Film") {
            fetchTopRatedMovies();
        } else if (sortOption === "Highest Rated" && type === "Film") {
            fetchHighestRatedMovies();
        } else if (sortOption === "Most Reviewed" && type === "TV Series") {
            fetchTopRatedTV();
        } else if (sortOption === "Highest Rated" && type === "TV Series") {
            fetchHighestRatedTV()
        }
        ;
    }, [sortOption, type, startDate, endDate])

    return (
        <div>
            <div className="pl-5 flex flex-row space-x-5">
                <Selector
                    onChange={handleSortOptionChange}
                    name="sortOption"
                    value={sortOption}
                    options={adminSortOptions}
                    label="Sort"
                />
                <Selector
                    onChange={handleTypeChange}
                    name="type"
                    value={type}
                    options={typeOptions}
                    label="Type"
                />
                <h1 className="text-xl font-semibold ">Start date : </h1>
                <input
                    type="date"
                    className={commonInputClasses + " border-2 rounded p-1 w-auto "}
                    onChange={handleStartDateChange}
                    name="startDate"
                    value={startDate}
                />
                <h1 className="text-xl font-semibold ">End date : </h1>
                <input
                    type="date"
                    className={commonInputClasses + " border-2 rounded p-1 w-auto "}
                    onChange={handleEndDateChange}
                    name="endDate"
                    value={endDate}
                />
            </div>
            <div className="space-y-3 p-5">
                <div className="overflow-auto rounded-lg shadow hidden md:block">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                            <th className="w-20 p-3 text-md font-semibold tracking-wide text-left">#</th>
                            <th className="p-5 text-md font-semibold tracking-wide text-left">Image</th>
                            <th className="p-5 text-md font-semibold tracking-wide text-left">Name</th>
                            <th className="w-24 p-3 text-md font-semibold tracking-wide text-left">Reviews count</th>
                            <th className="w-24 p-3 text-md font-semibold tracking-wide text-left">Rating</th>
                        </tr>
                        </thead>
                        {movies.map((m, index) => {
                            return (
                                <tbody className="divide-y divide-gray-100">
                                <tr className="bg-white">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <div className="w-24">
                                            <h1 className="font-bold text-black-500 hover:underline">
                                                {index + 1}
                                            </h1>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="w-24">
                                            <img className="w-full aspect-video" src={m.poster} alt={m.title}/>
                                        </div>
                                    </td>
                                    <td className="w-full pl-5">
                                        <div>
                                            <Link to={`/reviews/${m.id}?startDate=${startDate}&endDate=${endDate}`}>
                                                <h1 className="text-lg font-semibold text-primary dark:text-white">
                                                    {m.title}
                                                </h1>
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-5">
                                        <h1 className="text-lg font-semibold text-primary dark:text-white">
                                            {m.reviews.reviewCount}
                                        </h1>
                                    </td>
                                    <td className="px-5">
                                        <h1 className="text-lg font-semibold text-primary dark:text-white">
                                            {m.reviews.ratingAvg}
                                        </h1>
                                    </td>
                                </tr>
                                </tbody>
                            )
                        })}
                    </table>
                </div>
            </div>
        </div>
    )
}
