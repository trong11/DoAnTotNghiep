import React from "react";

export default function Title({children}) {
    return (
        <h1 className="text-3xl font-semibold text-center text-orange-500 ">
            {children}
        </h1>
    );
}
