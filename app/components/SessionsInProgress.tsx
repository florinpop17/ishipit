import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const SessionsInProgress = () => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            const { data, error } = await supabase
                .from("sessions")
                .select("*, user:profiles(*)")
                .is("end_time", null)
                .order("start_time", { ascending: false });

            if (error) {
                console.error("Error fetching sessions:", error);
            } else {
                setSessions(data);
            }
            setLoading(false);
        };

        fetchSessions();

        const subscription = supabase
            .channel("sessions")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "sessions" },
                (payload) => {
                    fetchSessions();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const SessionTimer = ({ startTime }: { startTime: string }) => {
        const [duration, setDuration] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
                setDuration(
                    new Date().getTime() -
                        new Date(startTime).getTime() +
                        new Date().getTimezoneOffset() * 60000
                );
            }, 1000);

            return () => clearInterval(interval);
        }, [startTime]);

        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);

        return (
            <span className="text-gray-500">
                {hours}h {minutes}m {seconds}s
            </span>
        );
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Sessions In Progress
            </h2>
            <ul className="space-y-4">
                {sessions.map((session) => (
                    <li
                        key={session.id}
                        className="bg-white border border-gray-300 rounded-lg p-4"
                    >
                        <div className="flex justify-between items-center">
                            <span className="flex items-center font-semibold text-gray-700">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                {session.user.name}
                            </span>
                            <SessionTimer startTime={session.start_time} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SessionsInProgress;
