import React, {useEffect, useRef, useState} from 'react';
import Title from "../form/Title";
import Submit from "../form/Submit";
import {useLocation, useNavigate} from "react-router-dom";
import {resendEmailVerificationToken, verifyUserEmail} from "../../api/auth";
import {useAuth, useNotification} from "../../hooks";

const OTP_LENGTH = 6;

const isValidOTP = (otp) => {
    let valid = false;
    for (let val of otp) {
        valid = !isNaN(parseInt(val));
        if (!valid) break;
    }
    return valid;
}

export default function EmailVerification() {
    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
    const [activeOtpIndex, setActiveOtpIndex] = useState(0);

    const {isAuth, authInfo} = useAuth();
    const {isLoggedIn, profile} = authInfo;
    const isVerified = profile?.isVerified;

    const inputRef = useRef();
    const {state} = useLocation();
    const user = state?.user;

    const navigate = useNavigate();
    const {updateNotification} = useNotification();

    const focusNextInputField = (index) => {
        setActiveOtpIndex(index + 1);
    }

    const handleOTPResend = async () => {
       const {error, message} =  await resendEmailVerificationToken(user.id);

       if(error) return updateNotification('error', error);
       updateNotification('success', message);
    }

    const handleKeyDown = ({key}, index) => {
        if (key === 'Backspace') {
            focusPrevInputField(index);
        }
    }

    const focusPrevInputField = (index) => {
        let nextIndex;
        const diff = index - 1;
        nextIndex = diff !== 0 ? diff : 0;
        setActiveOtpIndex(nextIndex);
    }

    const handleOtpChange = ({target}, index) => {
        const {value} = target;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1, value.length);

        if (!value) focusPrevInputField(index)
        else focusNextInputField(index)

        setOtp([...newOtp]);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidOTP(otp)) {
            return updateNotification("error", "invalid otp");
        }
        const {error, message, user: userResponse} = await verifyUserEmail({OTP: otp.join(''), userId: user.id});
        if (error) updateNotification('error', error);

        updateNotification('success', message);
        localStorage.setItem('auth-token', userResponse.token);
        isAuth();
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [activeOtpIndex])

    useEffect(() => {
        if (!user) navigate('/not-found');
        if (isLoggedIn && isVerified) navigate('/');
    }, [user, isLoggedIn, isVerified])

    // if(!user) return null;

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-amber-100 rounded-md shadow-md shadow-orange-500 lg:max-w-xl">

                <form className="mt-6 space-y-4 " onSubmit={handleSubmit}>
                    <div>
                        <Title> Please enter your OTP to verify your account </Title>
                        <p className="text-center text-black"> OTP has been sent to your email </p>
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                        {otp.map((_, index) => {
                                return <input
                                    ref={activeOtpIndex === index ? inputRef : null}
                                    key={index}
                                    type="number"
                                    value={otp[index] || ""}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 border-2 border-orange-500 focus:border-white rounded bg-transparent outline-none
                                    text-center text-orange-500 font-semibold text-xl spin-button-none"/>
                            }
                        )}
                    </div>
                    <div>
                        <Submit value="Verify Account"/>
                        <button

                            type="button"
                            className="text-blue-500 font-semibold hover:underline mt-2"> I dont have OTP</button>
                    </div>
                </form>
            </div>
        </div>
    );
}