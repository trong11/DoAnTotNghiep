import React from "react";
import {Link, NavLink} from "react-router-dom";
import {AiOutlineHome} from "react-icons/ai";
import {BiMoviePlay} from "react-icons/bi";
import {FaPenFancy, FaUserNinja} from "react-icons/fa";
import {FiLogOut} from "react-icons/fi";
import {useAuth} from "../../hooks";
import {GiDirectorChair} from "react-icons/gi";
import {MdLeaderboard} from "react-icons/md";



export default function Navbar() {
    const {handleLogout} = useAuth();
    return <nav className="w-48 min-h-screen bg-orange-500 border-r border-orange-50 ">
        <div className="flex flex-col justify-between p1-5 h-screen sticky top-0">
            <ul>
                <li className="mb-8">
                    <Link to='/'>
                        <img src="./logo.png" alt="logo" className="h-14 p-2"/>
                    </Link>
                </li>
                <li>
                    <NavItem to="/">
                        <AiOutlineHome/>
                        <span>Home</span>
                    </NavItem>
                </li>
                <li>
                    <NavItem to='/movies'>
                        <BiMoviePlay/>
                        <span> Movies </span>
                    </NavItem>
                </li>
                <li>
                    <NavItem to='/actors'>
                        <FaUserNinja/>
                        <span> Actors </span>
                    </NavItem>
                </li>
                <li>
                    <NavItem to='/directors'>
                        <GiDirectorChair />
                        <span> Directors </span>
                    </NavItem>
                </li>
                <li>
                    <NavItem to='/writers'>
                        <FaPenFancy  />
                        <span> Writers </span>
                    </NavItem>
                </li>
                <li>
                    <NavItem to='/user-leaderboard'>
                        <MdLeaderboard  />
                        <span> User Leaderboard </span>
                    </NavItem>
                </li>
                <li>
                    <NavItem to='/movie-leaderboard'>
                        <MdLeaderboard  />
                        <span> Movie Leaderboard </span>
                    </NavItem>
                </li>
            </ul>
            <div className="flex flex-col items-start pb-5">
                <span className="font-semibold text-white text-xl"> Admin </span>
                <Link to="/" onClick={handleLogout} className="flex items-center text-dark-subtle text-sm hover:text-white transition space-x-1">
                    <FiLogOut/>
                    <span> Logout </span>
                </Link>
            </div>
        </div>
    </nav>
}

const NavItem = ({ children, to }) => {
    const commonClasses =
        " flex items-center text-lg space-x-2 p-2 hover:opacity-80";
    return (
        <NavLink
            className={({ isActive }) =>
                (isActive ? "text-white" : "text-zinc-600") + commonClasses
            }
            to={to}
        >
            {children}
        </NavLink>
    );
};