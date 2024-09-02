"use client";

import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import CompletedSessionsToday from "../components/CompletedSessionsToday";
import SessionsInProgress from "../components/SessionsInProgress";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();
    }, [setSession]);

    if (!session) {
        return <p>You must be logged in to view this page.</p>;
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
