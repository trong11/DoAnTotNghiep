import React from "react";
import {Link} from 'react-router-dom'

export default function CustomLink({to, children}) {
    return (
        <Link className="text-xs text-orange-500 hover:underline"
              to={to}
        >
            {children}
        </Link>
    );
}
