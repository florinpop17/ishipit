"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OnlineUsers() {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const fetchOnlineUsers = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("is_online", true);

            if (error)
                console.error("Error fetching online users:", error.message);
            else setOnlineUsers(data);
        };

        fetchOnlineUsers();
    }, []);

    return (
        <div>
            <h1>Online Users</h1>
            <ul>
                {onlineUsers.map((user) => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
}
