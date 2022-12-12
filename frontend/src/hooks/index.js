import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { NotificationContext } from "../context/NotificationProvider";
import { SearchContext } from "../context/SearchProvider";
import {MovieContext} from "../context/MoviesProvider";


export const useNotification = () => useContext(NotificationContext);
export const useAuth = () => useContext(AuthContext);
export const useSearch = () => useContext(SearchContext);
export const useMovies = () => useContext(MovieContext);