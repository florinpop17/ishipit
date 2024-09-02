import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const CompletedSessionsToday = () => {
    const [sessions, setSessions] = useState<any[]>([]); // Define the type for sessions
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const { data, error } = await supabase
                .from("sessions")
                .select("*, user:profiles(*)")
                .gte("end_time", today.toISOString())
                .lt("end_time", tomorrow.toISOString())
                .order("end_time", { ascending: false });

            if (error) {
                console.error("Error fetching sessions:", error);
            } else {
                setSessions(data);
            }
            setLoading(false);
        };

        fetchSessions();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Completed Sessions Today
            </h2>
            <ul className="space-y-4">
                {sessions.map((session) => {
                    const duration =
                        new Date(session.end_time).getTime() -
                        new Date(session.start_time).getTime();
                    const hours = Math.floor(duration / 3600000);
                    const minutes = Math.floor((duration % 3600000) / 60000);
                    const seconds = Math.floor((duration % 60000) / 1000);
                    return (
                        <li
                            key={session.id}
                            className="bg-white border border-gray-300 rounded-lg p-4"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-700">
                                    {session.user.name}
                                </span>
                                <span className="text-gray-500">
                                    {hours}h {minutes}m {seconds}s
                                </span>
                            </div>
                            {/* <p className="text-gray-600 text-sm">
                                {new Date(session.end_time).toLocaleString()}{" "}
                            </p> */}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CompletedSessionsToday;
