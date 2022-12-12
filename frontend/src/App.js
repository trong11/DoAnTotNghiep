import React from "react";
import Navbar from "./components/user/Navbar";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import EmailVerification from "./components/auth/EmailVerification";
import ForgetPassword from "./components/auth/ForgetPassword";
import ConfirmPassword from "./components/auth/ConfirmPassword";
import NotFound from "./components/NotFound";
import {useAuth} from "./hooks";
import AdminNavigator from "./navigator/AdminNavigator";
import SingleMovie from "./components/user/SingleMovie";
import MovieReviews from "./components/user/MovieReviews";
import SearchMovies from "./components/user/SearchMovies";
import AllMovies from "./components/user/AllMovies";
import AllTVSeries from "./components/user/AllTVSeries";
import FilterMovies from "./components/user/FilterMovies";
import FilterTvSeries from "./components/user/FilterTvSeries";
import MyReviews from "./components/user/MyReviews";
import Images from "./components/user/Images";
import Videos from "./components/user/Videos";
import Actor from "./components/user/Actor";

export default function App() {
    const {authInfo}  = useAuth();
    const isAdmin = authInfo.profile?.role === 'admin';

    if(isAdmin) return <AdminNavigator />

    return (
        <div >
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/auth/signin' element={<Signin />}/>
                <Route path='/auth/signup' element={<Signup />}/>
                <Route path='/auth/verification' element={<EmailVerification />}/>
                <Route path='/auth/forget-password' element={<ForgetPassword />}/>
                <Route path='/auth/reset-password' element={<ConfirmPassword />}/>
                <Route path='/movie/:movieId' element={<SingleMovie />}/>
                <Route path='/movie/images/:movieId' element={<Images />}/>
                <Route path='/movie/videos/:movieId' element={<Videos />}/>
                <Route path='/movie/reviews/:movieId' element={<MovieReviews />}/>
                <Route path="/movie/search" element={<SearchMovies />} />
                <Route path="/movies" element={<AllMovies />} />
                <Route path="/tv" element={<AllTVSeries />} />
                <Route path="/movie/filter" element={<FilterMovies />}/>
                <Route path="/tv/filter" element={<FilterTvSeries/>}/>
                <Route path="/my-reviews" element={<MyReviews/>}/>
                <Route path="/actor/:actorId" element={<Actor/>}/>
                <Route path='*' element={<NotFound />} />
            </Routes>
        </div>
    )
}