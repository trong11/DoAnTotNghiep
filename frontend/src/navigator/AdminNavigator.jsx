import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import MovieUpload from "../components/admin/MovieUpload";
import Navbar from "../components/admin/Navbar";
import ActorUpload from "../components/models/ActorUpload";
import NotFound from "../components/NotFound";
import SearchMovies from "../components/admin/SearchMovie";
import DirectorUpload from "../components/models/DirectorUpload";
import Directors from "../components/admin/Directors";
import WriterUpload from "../components/models/WriterUpload";
import Writers from "../components/admin/Writers";
import UserLeaderboard from "../components/admin/UserLeaderboard";
import MovieLeaderboard from "../components/admin/MovieLeaderboard";
import ReviewsByDate from "../components/admin/ReviewsByDate";

export default function AdminNavigator() {
    const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
    const [showActorUploadModal, setShowActorUploadModal] = useState(false);
    const [showDirectorUploadModal, setShowDirectorUploadModal] = useState(false);
    const [showWriterUploadModal, setShowWriterUploadModal] = useState(false);

    const displayMovieUploadModal = () => {
        setShowMovieUploadModal(true);
    };

    const hideMovieUploadModal = () => {
        setShowMovieUploadModal(false);
    };

    const displayActorUploadModal = () => {
        setShowActorUploadModal(true);
    };

    const hideActorUploadModal = () => {
        setShowActorUploadModal(false);
    };

    const displayDirectorUploadModal = () => {
        setShowDirectorUploadModal(true);
    };

    const hideDirectorUploadModal = () => {
        setShowDirectorUploadModal(false);
    };

    const displayWriterUploadModal = () => {
        setShowWriterUploadModal(true);
    };

    const hideWriterUploadModal = () => {
        setShowWriterUploadModal(false);
    };

    return (
        <>
            <div className="flex dark:bg-primary bg-white">
                <Navbar />
                <div className="flex-1 max-w-screen-xl">
                    <Header
                        onAddMovieClick={displayMovieUploadModal}
                        onAddActorClick={displayActorUploadModal}
                        onAddDirectorClick={displayDirectorUploadModal}
                        onAddWriterClick={displayWriterUploadModal}
                    />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/actors" element={<Actors />} />
                        <Route path="/directors" element={<Directors />} />
                        <Route path="/writers" element={<Writers />} />
                        <Route path="/search" element={<SearchMovies />} />
                        <Route path="/reviews/:movieId" element={<ReviewsByDate />} />
                        <Route path="/user-leaderboard" element={<UserLeaderboard />} />
                        <Route path="/movie-leaderboard" element={<MovieLeaderboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
            <MovieUpload
                visible={showMovieUploadModal}
                onClose={hideMovieUploadModal}
            />
            <ActorUpload
                visible={showActorUploadModal}
                onClose={hideActorUploadModal}
            />
            <DirectorUpload
                visible={showDirectorUploadModal}
                onClose={hideDirectorUploadModal}
            />
            <WriterUpload
                visible={showWriterUploadModal}
                onClose={hideWriterUploadModal}
            />
        </>
    );
}
