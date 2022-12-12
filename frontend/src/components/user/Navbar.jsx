import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import Container from "../Container";
import "../../css/navbar-style.css"
import {CgProfile} from "react-icons/cg";

export default function Navbar({fixed}) {
    const {authInfo, handleLogout} = useAuth();
    const {isLoggedIn, profile} = authInfo;
    const [value, setValue] = useState("");


    const navigate = useNavigate();

    const handleSearchSubmit = () => {
        navigate("/movie/search?title=" + value);
    };

    return (
        <>  <Container className="pt-3">
            <nav
                className="flex items-center justify-between flex-wrap bg-orange-500 py-4 lg:px-12 shadow border-solid border-t-2 border-blue-700 w-full">
                <div
                    className="flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-gray-300 pb-5 lg:pb-0">
                    <div className="flex items-center flex-shrink-0 text-gray-800 mr-16">
                        <Link to="/">
                            <img src="./logo.png" alt="" className="h-10"/>
                        </Link>
                    </div>
                    <div className="block lg:hidden ">
                        <button
                            id="nav"
                            className="flex items-center px-3 py-2 border-2 rounded text-white border-blue-700 hover:text-blue-700 hover:border-blue-700">
                            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="menu w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8">
                    <div className="text-md font-bold text-white lg:flex-grow">
                        <Link to="/movies"
                              className="block mt-4 lg:inline-block lg:mt-0 hover:text-black px-4 py-2 rounded hover:bg-white mr-2">
                            Movies
                        </Link>
                        <a href="/tv"
                           className=" block mt-4 lg:inline-block lg:mt-0 hover:text-black px-4 py-2 rounded hover:bg-white mr-2">
                            TV Series
                        </a>
                    </div>
                    <div className="relative mx-auto text-gray-600 lg:block hidden">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                className="border-2 border-gray-300 bg-white h-10 pl-2 pr-8 rounded-lg text-sm focus:outline-none"
                                type="text" name="title" placeholder="Search" value={value}
                                onChange={({target}) => setValue(target.value)}/>
                        </form>
                    </div>
                    {isLoggedIn ? (
                        <div className="dropdown ml-2">
                            <button
                                className=" block text-md px-4 py-2 rounded text-white  font-bold hover:text-black mt-4 hover:bg-white lg:mt-0.5 ">
                                <div className="flex flex-row space-x-3">
                                    <CgProfile className="mt-1"/>
                                    <div className="ml-2">
                                        {profile.name}
                                    </div>
                                </div>
                            </button>
                            <div className="dropdown-content">
                                <Link to="/my-reviews">My Reviews</Link>
                                <Link onClick={handleLogout}>Log out</Link>
                            </div>
                        </div>
                    ) : (
                        <Link
                            className="block text-md px-4 py-2 ml-2 rounded text-white font-bold hover:text-black hover:bg-white "
                            to="/auth/signin"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </Container>
        </>
    );
}
