"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Timer from "../components/Timer";
import CompletedSessionsToday from "../components/CompletedSessionsToday";
import SessionsInProgress from "../components/SessionsInProgress";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
    const [session, setSession] = useState(null);
    const [username, setUsername] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const getSessionAndUsername = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            setSession(sessionData.session);

            if (sessionData.session) {
                const { data: userData, error } = await supabase
                    .from("profiles")
                    .select("username")
                    .eq("id", sessionData.session.user.id)
                    .single();

                if (error) {
                    console.error("Error fetching username:", error);
                } else {
                    setUsername(userData.username);
                }
            }
        };
        getSessionAndUsername();
    }, []);

    if (!session) {
        return (
            <p className="text-center p-4 text-lg">
                You must be logged in to view this page.
            </p>
        );
    }

    if (!username) {
        return (
            <div className="text-center p-4">
                <p className="text-lg mb-4">
                    Please set your username to continue.
                </p>
                <button
                    onClick={() => router.push("/profile")}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Go to Profile
                </button>
            </div>
        );
    }

    return (
        <main className="flex flex-col gap-8 p-4">
            <Timer session={session} />
            <div className="flex justify-center flex-row gap-4">
                <SessionsInProgress session={session} />
                <CompletedSessionsToday session={session} />
            </div>
        </main>
    );
}
