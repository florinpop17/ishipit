"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [timezone, setTimezone] = useState("");
    const [session, setSession] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();
    }, [setSession]);

    useEffect(() => {
        const getProfile = async () => {
            if (session) {
                const { user } = session;
                const { data, error } = await supabase
                    .from("profiles")
                    .select("username, name, timezone")
                    .eq("id", user.id)
                    .single();

                if (data) {
                    setUsername(data.username);
                    setName(data.name);
                    setTimezone(data.timezone);
                } else if (error) {
                    console.error("Error fetching profile:", error.message);
                }
            }
        };
        getProfile();
    }, [session]);

    if (!session) {
        return <p>You must be logged in to view this page.</p>;
    }

    const handleSave = async () => {
        const { user } = session;
        const { error } = await supabase
            .from("profiles")
            .upsert({ id: user.id, username, name, timezone });

        if (error) console.error("Error saving profile:", error.message);
        else alert("Profile updated!");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-3xl mb-6">Profile</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 p-2 rounded bg-gray-800 text-white w-64"
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4 p-2 rounded bg-gray-800 text-white w-64"
            />
            <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mb-4 p-2 rounded bg-gray-800 text-white w-64"
            >
                <option value="" disabled>
                    Select your timezone
                </option>
                <option value="UTC-12:00">UTC-12:00</option>
                <option value="UTC-11:00">UTC-11:00</option>
                <option value="UTC-10:00">UTC-10:00</option>
                <option value="UTC-09:00">UTC-09:00</option>
                <option value="UTC-08:00">UTC-08:00</option>
                <option value="UTC-07:00">UTC-07:00</option>
                <option value="UTC-06:00">UTC-06:00</option>
                <option value="UTC-05:00">UTC-05:00</option>
                <option value="UTC-04:00">UTC-04:00</option>
                <option value="UTC-03:00">UTC-03:00</option>
                <option value="UTC-02:00">UTC-02:00</option>
                <option value="UTC-01:00">UTC-01:00</option>
                <option value="UTC+00:00">UTC+00:00</option>
                <option value="UTC+01:00">UTC+01:00</option>
                <option value="UTC+02:00">UTC+02:00</option>
                <option value="UTC+03:00">UTC+03:00</option>
                <option value="UTC+04:00">UTC+04:00</option>
                <option value="UTC+05:00">UTC+05:00</option>
                <option value="UTC+06:00">UTC+06:00</option>
                <option value="UTC+07:00">UTC+07:00</option>
                <option value="UTC+08:00">UTC+08:00</option>
                <option value="UTC+09:00">UTC+09:00</option>
                <option value="UTC+10:00">UTC+10:00</option>
                <option value="UTC+11:00">UTC+11:00</option>
                <option value="UTC+12:00">UTC+12:00</option>
            </select>
            <button
                onClick={handleSave}
                className="p-2 rounded bg-purple-600 hover:bg-purple-700 w-64"
            >
                Save
            </button>
        </div>
    );
}
