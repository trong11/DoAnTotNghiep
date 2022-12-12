import React, {useEffect, useState} from "react";
import {useMovies, useNotification} from "../../hooks";
import MovieListItem from "../MovieListItem";
import NextAndPrevButton from "../NextAndPrevButton";

const limit = 10;
let currentPageNo = 0;

export default function Movies() {
    const {
        fetchMovies,
        movies: newMovies,
        fetchPrevPage,
        fetchNextPage,
    } = useMovies();

    const handleUIUpdate = () => {
        fetchMovies();
    };

    useEffect(() => {
        fetchMovies(currentPageNo);
    }, []);

    return (
        <>
            <div className="space-y-3 p-5">
                <table>
                    <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Poster</th>
                        <th className="py-3 px-6 text-left">Title</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                    </thead>
                    {newMovies.map((movie) => {
                        return (
                            <MovieListItem
                                key={movie.id}
                                movie={movie}
                                afterDelete={handleUIUpdate}
                                afterUpdate={handleUIUpdate}
                            />
                        );
                    })}
                </table>

                <NextAndPrevButton
                    className="mt-5"
                    onNextClick={fetchNextPage}
                    onPrevClick={fetchPrevPage}
                />
            </div>
        </>
    );
}
