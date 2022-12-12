import React, {useState} from 'react';
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import {forgetPassword} from "../../api/auth";
import {isValidEmail} from "../../utils/helper";
import {useNotification} from "../../hooks";

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const {updateNotification} = useNotification();

    const handleChange = ({target}) => {
        const {value} = target;
        setEmail(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!isValidEmail(email)) return updateNotification('error', 'Invalid Email');

        const {error, message} = await forgetPassword(email);
        if(error) return updateNotification('error', error);

        updateNotification('success', message);
    };

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-amber-100 rounded-md shadow-md shadow-orange-500 lg:max-w-xl">

                <form onSubmit={handleSubmit} className="mt-6 space-y-6 ">
                    <Title> Please Enter Your Email </Title>
                    <FormInput onChange={handleChange}
                               value={email}
                               label='Email'
                               name='email'/>
                    <Submit value="Send Link"/>
                    <CustomLink to="/auth/signin"> Sign In </CustomLink>
                </form>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Don't have an account?{" "}
                    <CustomLink to="/auth/signup"> Sign Up </CustomLink>
                </p>
            </div>
        </div>
    );
}