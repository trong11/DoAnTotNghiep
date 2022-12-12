import React from "react";
import Container from "./Container";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import TopRatedTVSeries from "./user/TopRatedTVSeries";
import HeroSlideshow from "./user/HeroSlidShow";
import HighestRatedMovies from "./user/HighestRatedMovies";
import HighestRatedTVSeries from "./user/HighestRatedTVSeries";

export default function Home() {
    return (
        <div className="dark:bg-primary bg-white min-h-screen">
            <Container className="px-2 xl:p-0">
                <NotVerified/>
                {/* slider */}
                {/* Most rated movies */}
                <HeroSlideshow/>
                <TopRatedMovies/>
                <TopRatedTVSeries/>
                <HighestRatedMovies/>
                <HighestRatedTVSeries/>
            </Container>
        </div>
    );
}
