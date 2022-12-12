import React, { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import {languageOptions, nationalityOptions} from "../../utils/options";

const defaultActorInfo = {
    name: "",
    about: "",
    avatar: null,
    gender: "",
    dob:"",
    nationality:"",
};

const genderOptions = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
    { title: "Other", value: "other" },
];

const validateActor = ({ avatar, name, about, gender }) => {
    if (!name.trim()) return { error: "Actor name is missing!" };
    if (!about.trim()) return { error: "About section is empty!" };
    if (!gender.trim()) return { error: "Actor gender is missing!" };
    if (avatar && !avatar.type?.startsWith("image"))
        return { error: "Invalid image / avatar file!" };

    return { error: null };
};

export default function ActorForm({
                                      title,
                                      initialState,
                                      btnTitle,
                                      busy,
                                      onSubmit,
                                  }) {
    const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
    const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");
    const { updateNotification } = useNotification();

    const updatePosterForUI = (file) => {
        const url = URL.createObjectURL(file);
        setSelectedAvatarForUI(url);
    };

    const handleChange = ({ target }) => {
        const { value, files, name } = target;
        if (name === "avatar") {
            const file = files[0];
            updatePosterForUI(file);
            return setActorInfo({ ...actorInfo, avatar: file });
        }

        setActorInfo({ ...actorInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { error } = validateActor(actorInfo);
        if (error) return updateNotification("error", error);

        // submit form
        const formData = new FormData();
        for (let key in actorInfo) {
            if (key) formData.append(key, actorInfo[key]);
        }
        onSubmit(formData);
    };

    useEffect(() => {
        if (initialState) {
            setActorInfo({ ...initialState, dob: initialState.dob.split("T")[0], avatar: null });
            setSelectedAvatarForUI(initialState.avatar);
        }
    }, [initialState]);

    const { name, about, gender, dob, nationality } = actorInfo;
    console.log(dob);
    return (
        <form
            className="dark:bg-primary bg-white p-3 w-[50rem] h-[40rem] rounded"
            onSubmit={handleSubmit}
        >
            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl dark:text-white text-primary">
                    {title}
                </h1>
                <button
                    className="h-8 w-24 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center"
                    type="submit"
                >
                    {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
                </button>
            </div>

            <div className="flex space-x-2">
                <PosterSelector
                    selectedPoster={selectedAvatarForUI}
                    className="w-36 h-36 aspect-square object-cover"
                    name="avatar"
                    onChange={handleChange}
                    lable="Select avatar"
                    accept="image/jpg, image/jpeg, image/png"
                />
                <div className="flex-grow flex flex-col space-y-2 ">
                    <input
                        placeholder="Enter name"
                        type="text"
                        className={commonInputClasses + " border-b-2"}
                        name="name"
                        value={name}
                        onChange={handleChange}
                    />
                    <textarea
                        name="about"
                        value={about}
                        onChange={handleChange}
                        placeholder="About"
                        className={commonInputClasses + " border-b-2 resize-none h-[20rem]"}
                    ></textarea>
                    <input
                        type="date"
                        className={commonInputClasses + " border-2 rounded p-1 h-10 w-auto"}
                        onChange={handleChange}
                        name="dob"
                        value={dob}
                    />
                    <Selector
                        onChange={handleChange}
                        name="nationality"
                        value={nationality}
                        options={nationalityOptions}
                        label="Nationality"
                    />

                </div>
            </div>

            <div className="mt-0.5">
                <Selector
                    options={genderOptions}
                    label="Gender"
                    value={gender}
                    onChange={handleChange}
                    name="gender"
                />
            </div>
        </form>
    );
}
