import React from "react";

export default function FormInput({name, label, ...rest}) {
    return (
            <div className="mb-2">
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-800"
                >
                    {label}
                </label>
                <input
                    id={name}
                    name={name}
                    className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-orange-500 focus:ring-orange-500
                            focus:outline-none focus:ring focus:ring-opacity-40"
                    {...rest}
                />
            </div>
    );
}
