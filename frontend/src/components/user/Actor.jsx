import React, {useEffect, useState} from "react";
import Container from "../Container";
import {useParams} from "react-router-dom";
import {getActorProfile} from "../../api/actor";
import {useNotification} from "../../hooks";

const convertDate = (date = "") => {
    return date.split("T")[0];
};

export default function Actor() {
    const [actor, setActor] = useState({});

    const {actorId} = useParams();
    const { updateNotification } = useNotification();

    const fetchActorProfile = async () => {
        const { error, actor } = await getActorProfile(actorId);
        if (error) return updateNotification("error", error);
        setActor(actor);
    };

    useEffect(() => {
         fetchActorProfile();
    }, [actorId]);

    return (
        <Container>
            <div className="flex flex-row">
                <div className="flex flex-col w-[30%]">
                    <img src={actor.avatar}
                         className="pt-3 w-full" alt="dipper" />
                    <h1 className="font-semibold text-xl">Gender : </h1>
                    <h1> {actor.gender} </h1>
                    <h1 className="font-semibold text-xl">Date of birth : </h1>
                    <h1> {convertDate(actor.dob)} </h1>
                    <h1 className="font-semibold text-xl">Nationality : </h1>
                    <h1> {actor.nationality} </h1>
                </div>
                <div className="flex flex-col pl-5">
                    <h1 className="text-4xl pt-3">{actor.name}</h1>
                    <p className="text-xl pt-3"> {actor.about} </p>

                </div>
            </div>
        </Container>
    );
}
