import React, {useEffect, useState} from 'react';
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import {createUser} from "../../api/auth";
import {useNavigate} from "react-router-dom";
import {useAuth, useNotification} from "../../hooks";
import {isValidEmail} from "../../utils/helper";


const validateUserInfo = ({name, email, password}) => {

    if (!name.trim()) return {ok: false, error: 'Name is missing'}
    if (!/^[a-z A-Z]+$/.test(name)) return {ok: false, error: 'Invalid name'}

    if (!email.trim()) return {ok: false, error: 'Email is missing'}
    if (!isValidEmail(email)) return {ok: false, error: 'Invalid email'}

    if (!password.trim()) return {ok: false, error: 'Password is missing!!'}
    if (password.length < 8) return {ok: false, error: 'Password must be 8 characters long !'}

    return {ok: true}

}

export default function Signup() {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const {updateNotification} = useNotification();
    const {authInfo} = useAuth();
    const {isLoggedIn} = authInfo;

    const handleChange = ({target}) => {
        const {value, name} = target;
        setUserInfo({...userInfo, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {ok, error} = validateUserInfo(userInfo);

        if (!ok) return updateNotification('error', error);

        const response = await createUser(userInfo);
        if (response.error) return console.log(response.error);

        navigate('/auth/verification', {state: {user: response.user}, replace: true});

    };

    const {name, email, password} = userInfo;

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn])


    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-amber-100 rounded-md shadow-md shadow-orange-500 lg:max-w-xl">

                <form onSubmit={handleSubmit} className="mt-6 space-y-6 ">
                    <Title> Sign up </Title>
                    <FormInput onChange={handleChange} value={name} label='Name' name='name'/>
                    <FormInput onChange={handleChange} value={email} label='Email' name='email'/>
                    <FormInput onChange={handleChange} value={password} label='Password' name='password'
                               type='password'/>

                    <Submit value="Sign Up"/>
                    <CustomLink to="/auth/forget-password"> Forget Password </CustomLink>
                </form>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Already have an account?{" "}
                    <CustomLink to="/auth/signin"> Sign In </CustomLink>
                </p>
            </div>
        </div>
    );
}