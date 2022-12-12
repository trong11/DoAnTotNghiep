import React, {useState} from "react";
import {BsTrash, BsPencilSquare, BsBoxArrowUpRight} from "react-icons/bs";
import {deleteMovie} from "../api/MovieApi";
import {useNotification} from "../hooks";
import ConfirmModal from "./models/ConfirmModal";
import UpdateMovie from "./models/UpdateMovie";

const MovieListItem = ({movie, afterDelete, afterUpdate}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [busy, setBusy] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const {updateNotification} = useNotification();

    const handleOnDeleteConfirm = async () => {
        setBusy(true);
        const {error, message} = await deleteMovie(movie.id);
        setBusy(false);

        if (error) return updateNotification("error", error);

        hideConfirmModal();
        updateNotification("success", message);
        afterDelete(movie);
    };

    const handleOnEditClick = () => {
        setShowUpdateModal(true);
        setSelectedMovieId(movie.id);
    };

    const handleOnUpdate = (movie) => {
        afterUpdate(movie);
        setShowUpdateModal(false);
        setSelectedMovieId(null);
    };

    const displayConfirmModal = () => setShowConfirmModal(true);
    const hideConfirmModal = () => setShowConfirmModal(false);

    const hideUpdateModal = () => {
        setShowUpdateModal(false);
    };

    return (
        <>
            <MovieCard
                movie={movie}
                onDeleteClick={displayConfirmModal}
                onEditClick={handleOnEditClick}
            />
            <div className="p-0">
                <ConfirmModal
                    visible={showConfirmModal}
                    onConfirm={handleOnDeleteConfirm}
                    onCancel={hideConfirmModal}
                    title="Are you sure?"
                    subtitle="This action will remove this movie permanently!"
                    busy={busy}
                />
                <UpdateMovie
                    movieId={selectedMovieId}
                    visible={showUpdateModal}
                    onSuccess={handleOnUpdate}
                    onClose = {hideUpdateModal}
                />
            </div>
        </>
    );
};

const MovieCard = ({movie, onDeleteClick, onEditClick, onOpenClick}) => {
    const {poster, title, genres = [], status} = movie;
    return (
        <tbody className="text-gray-600 text-sm font-light">
        <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td>
                <div className="w-24">
                    <img className="w-full aspect-video" src={poster} alt={title}/>
                </div>
            </td>
            <td className="w-full pl-5">
                <div>
                    <h1 className="text-lg font-semibold text-primary dark:text-white">
                        {title}
                    </h1>
                    <div className="space-x-1">
                        {genres.map((g, index) => {
                            return (
                                <span
                                    key={g + index}
                                    className=" text-primary dark:text-white text-xs"
                                >
                      {g}
                    </span>
                            );
                        })}
                    </div>
                </div>
            </td>

            <td className="px-5">
                <p className={status === 'public' ? "bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs" : "bg-yellow-200 text-yellow-600 py-1 px-3 rounded-full text-xs"}>{status}</p>
            </td>

            <td>
                <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
                    <button onClick={onDeleteClick} type="button">
                        <BsTrash/>
                    </button>
                    <button onClick={onEditClick} type="button">
                        <BsPencilSquare/>
                    </button>
                    <button onClick={onOpenClick} type="button">
                        <BsBoxArrowUpRight/>
                    </button>
                </div>
            </td>
        </tr>
        </tbody>
    );
};

export default MovieListItem;
