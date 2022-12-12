import React, {useEffect, useState, Component} from "react";
import {useNotification} from "../../hooks";
import {getMostReviewUser} from "../../api/admin";

export default function UserLeaderboard() {
    const [users, setUsers] = useState([]);
    const {updateNotification} = useNotification();

    const fetchUsers = async () => {
        const {users, error} = await getMostReviewUser();
        if (error) return updateNotification("error", error);
        setUsers(users);
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div className="space-y-3 p-5">
            <div className="overflow-auto rounded-lg shadow hidden md:block">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th className="w-20 p-3 text-md font-semibold tracking-wide text-left">#</th>
                        <th className="p-5 text-md font-semibold tracking-wide text-left">Name</th>
                        <th className="w-24 p-3 text-md font-semibold tracking-wide text-left">Reviews count</th>
                    </tr>
                    </thead>
                    {users.map((u, index) => {
                        return (
                            <tbody className="divide-y divide-gray-100">
                            <tr className="bg-white">
                                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                    <div className="w-24">
                                        <h1 className="font-bold text-black-500 hover:underline">
                                            {index + 1}
                                        </h1>
                                    </div>
                                </td>
                                <td className="w-full pl-5">
                                    <div>
                                        <h1 className="text-lg font-semibold text-primary dark:text-white">
                                            {u.name}
                                        </h1>
                                    </div>
                                </td>
                                <td className="px-5">
                                    <h1 className="text-lg font-semibold text-primary dark:text-white">
                                        {u.reviews.reviewCount}
                                    </h1>
                                </td>
                            </tr>
                            </tbody>
                        )
                    })}
                </table>
            </div>
        </div>
    )
}
